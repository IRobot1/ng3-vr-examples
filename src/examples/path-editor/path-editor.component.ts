import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, Intersection, Vector2, Vector3 } from "three";

import { InteractiveObjects, MenuItem } from "ng3-flat-ui";
import { BaseCommand, ControlPoint, CubicCurveCommand, HorizontalCommand, LineToCommand, MoveToCommand, PathPoint, QuadraticCurveCommand, VerticalCommand } from "./path-util";
import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './path-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathEditorExample implements OnInit, OnDestroy {
  selectable = new InteractiveObjects();

  commands: Array<BaseCommand> = [];
  controls: Array<ControlPoint> = [];

  points: Array<PathPoint> = [];

  dragging?: PathPoint;
  last!: PathPoint;

  showmore = true;
  moreposition = new Vector3(0, 0, 0.1)

  showmenu = false;
  menuposition = new Vector3(0, 0, 0.12)
  menuwidth = 1;

  showactions = false;
  actionposition = new Vector3(0, 0, 0.12)

  addcommand(command: BaseCommand) {
    let index = this.commands.findIndex(x => x.endpoint == this.last);
    const prev = this.commands[index];

    if (index == this.commands.length - 1)
      this.commands.push(command);
    else {

      this.commands.splice(index + 1, 0, command);
    }
    const next = this.commands[index];

    next.update(prev.endpoint);

    this.dump();
  }

  addpoint(item: PathPoint) {
    this.points.push(item);
    this.moreposition.x = item.position.x;
    this.moreposition.y = item.position.y;
    this.last = item;
    this.closemenus();
    this.updateFlag = true;
  }

  dump() {
    //this.commands.forEach(command => console.warn(command.endpoint, command.text))
  }

  actionmenu: Array<MenuItem> = [
    //{ text: 'M Move to', icon: '', enabled: true, selected: () => { } },
    {
      text: 'Line to', keycode: 'L', icon: '', enabled: true, selected: () => {
        const lineto = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y + 0.1));
        this.addcommand(new LineToCommand(lineto));
        this.addpoint(lineto);
      }
    },
    {
      text: 'Vertical Line to', keycode: 'V', icon: '', enabled: true, selected: () => {
        const vertical = new PathPoint(new Vector2(this.moreposition.x, this.moreposition.y + 0.1));
        vertical.changex = false;
        this.addcommand(new VerticalCommand(vertical));
        this.addpoint(vertical);
      }
    },
    {
      text: 'Horizontal Line to', keycode: 'H', icon: '', enabled: true, selected: () => {
        const horizontal = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y));
        horizontal.changey = false;
        this.addcommand(new HorizontalCommand(horizontal));
        this.addpoint(horizontal);
      }
    },
    {
      text: 'Cubic Curve to', keycode: 'C', icon: '', enabled: true, selected: () => {
        const cp1 = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y), 'green', true);
        const cp2 = new PathPoint(new Vector2(this.moreposition.x + 0.2, this.moreposition.y), 'green', true);
        const to = new PathPoint(new Vector2(this.moreposition.x + 0.3, this.moreposition.y));
        this.addcommand(new CubicCurveCommand(cp1, cp2, to));
        this.points.push(cp1);
        this.points.push(cp2);
        this.addpoint(to);
      }
    },
    {
      text: 'Bezier Curve to', keycode: 'Q', icon: '', enabled: true, selected: () => {
        const cp = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y), 'green', true);
        const to = new PathPoint(new Vector2(this.moreposition.x + 0.2, this.moreposition.y));
        this.addcommand(new QuadraticCurveCommand(cp, to));
        this.points.push(cp);
        this.addpoint(to);
      }
    },
    { text: 'Elliptical Arc', keycode: 'A', icon: '', enabled: true, selected: () => { } },
    {
      text: 'Close Path', keycode: 'Z', icon: '', enabled: true, selected: () => {
      }
    },
  ];

  menuitems: Array<MenuItem> = [
    { text: 'Insert After', keycode: '', icon: 'add', enabled: true, submenu: this.actionmenu, selected: () => { this.showactions = true } },
    //{ text: 'Convert To', icon: 'sync', enabled: true, submenu: this.actionmenu, selected: () => { this.showactions = true } },
    {
      text: 'Delete', keycode: 'DELETE', icon: 'delete', enabled: this.commands.length > 1, selected: () => {
        let index = this.commands.findIndex(x => x.endpoint == this.last);
        if (index > 0) {
          this.points = this.points.filter(x => x != this.last);

          const command = this.commands[index];
          this.commands.splice(index, 1);

          command.update(command.endpoint)

          this.last = this.commands[index - 1].endpoint;
          this.moreposition.x = this.last.position.x;
          this.moreposition.y = this.last.position.y;


          this.dump();
          this.updateFlag = true;
        }
        this.closemenus();
      }
    },
  ]

  @HostListener('document:keyup', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    let keycode = event.key.toUpperCase();

    let item = this.menuitems.find(x => x.keycode == keycode)
    if (item) {
      item.selected();
      return;
    }

    item = this.actionmenu.find(x => x.keycode == keycode)
    if (item)
      item.selected();
  }

  rowheight = 0.1;
  rowspacing = 0.01;
  margin = 0.03;

  morepressed() {
    let height = (this.rowheight + this.rowspacing) * this.menuitems.length + this.margin * 2;

    this.menuposition.x = this.moreposition.x + this.menuwidth / 2 + 0.1;
    this.menuposition.y = this.moreposition.y - height / 2 + 0.05;

    height = (this.rowheight + this.rowspacing) * this.actionmenu.length + this.margin * 2;
    this.actionposition.x = this.menuposition.x + this.menuwidth + 0.05;
    this.actionposition.y = this.moreposition.y - height / 2 + 0.05;

    this.showmenu = true;
  }

  closemenus() {
    this.showmore = this.showmenu = this.showactions = false;
  }

  changelast(item: PathPoint) {
    this.last = item;
    //console.warn('last updated')
  }

  startdrag(point: PathPoint) {
    //console.warn('start dragging')
    this.dragging = point;
    this.closemenus();
  }

  enddrag() {
    if (this.showmore) return;

    if (this.dragging) {
      this.moreposition.x = this.dragging.position.x;
      this.moreposition.y = this.dragging.position.y;

      this.dragging = undefined;
      const timer = setTimeout(() => {
        this.showmore = true;
        clearTimeout(timer)
      }, 100)

      //console.warn('end dragging')
    }
  }


  constructor(
    private cameraman: CameraService
  ) {
    this.cameraman.position = [0, 0, 2];

    let moveto = new PathPoint(new Vector2(0, 0), 'red');
    this.commands.push(new MoveToCommand(moveto));
    this.points.push(moveto);
    this.last = moveto;

    this.updateFlag = true;
  }

  snap = true;
  hit(event: Intersection) {
    if (this.dragging) {
      let x = event.point.x;
      let y = event.point.y;

      if (this.snap) {
        x = Math.round(x / 0.1) * 0.1;
        y = Math.round(y / 0.1) * 0.1;
      }
      x = +x.toFixed(2);
      y = +y.toFixed(2);

      // limit flickering 
      if (this.dragging.changex && this.dragging.changey) {
        if (x != this.dragging.position.x || y != this.dragging.position.y) {
          this.dragging.position.x = this.dragging.mesh.position.x = x;
          this.dragging.position.y = this.dragging.mesh.position.y = y;
          this.updateFlag = true;
        }
      } else if (this.dragging.changex) {
        if (x != this.dragging.position.x) {
          this.dragging.position.x = this.dragging.mesh.position.x = x;
          this.updateFlag = true;
        }
      } else if (this.dragging.changey) {
        if (y != this.dragging.position.y) {
          this.dragging.position.y = this.dragging.mesh.position.y = y;
          this.updateFlag = true;
        }
      }

      if (this.updateFlag) {
        let from = this.commands[0].endpoint
        this.commands.forEach(command => {
          command.update(from);
          from = command.endpoint;
        });
      }
      if (!this.dragging.control)
        this.last = this.dragging;
    }
  }

  private updateFlag = false;
  private redraw() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.drawshape();
    }
  }

  timer: any;

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.redraw();
    }, 1000 / 30);
  }

  curves: Array<BufferGeometry> = [];
  controllines: Array<BufferGeometry> = [];

  drawshape() {
    this.curves.length = this.controllines.length = 0;

    let from = this.commands[0].endpoint;
    this.commands.forEach(command => {

      command.update(from);
      if (command.geometry) this.curves.push(command.geometry);

      if (command instanceof CubicCurveCommand) {
        this.controllines.push(command.line1.geometry);
        this.controllines.push(command.line2.geometry);
      }
      else if (command instanceof QuadraticCurveCommand) {
        this.controllines.push(command.line1.geometry);
        this.controllines.push(command.line2.geometry);
      }

      from = command.endpoint;
    });
  }

}