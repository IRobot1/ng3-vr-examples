import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, Intersection, LatheGeometry, Mesh, Shape, ShapeGeometry, Vector2, Vector3 } from "three";

import { InteractiveObjects, MenuItem } from "ng3-flat-ui";
import { BaseCommand, ClosePathCommand, CLOSEPATHZ, ControlPoint, CONTROLPOINTZ, CubicCurveCommand, GUIZ, HorizontalCommand, LineToCommand, MENUZ, MoveToCommand, MOVETOZ, PathPoint, POINTZ, QuadraticCurveCommand, SHAPEZ, VerticalCommand } from "./path-util";
import { CameraService } from "../../app/camera.service";

import { Ng3GUI } from "ng3-gui";

@Component({
  templateUrl: './path-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathEditorExample implements OnInit, OnDestroy {
  selectable = new InteractiveObjects();

  commands: Array<BaseCommand> = [];
  controls: Array<ControlPoint> = [];

  points: Array<PathPoint> = [];

  yoffset = 1;
  shapez = SHAPEZ
  guiz = GUIZ

  dragging?: PathPoint;
  last!: PathPoint;

  showmore = true;
  moreposition = new Vector3(0, 0, MENUZ)

  showmenu = false;
  menuposition = new Vector3(0, 0, MENUZ)
  menuwidth = 1;

  showactions = false;
  actionposition = new Vector3(0, 0, MENUZ)

  addcommand(command: BaseCommand) {
    let index = this.commands.findIndex(x => x.endpoint == this.last);
    const prev = this.commands[index];

    if (index == this.commands.length - 1)
      this.commands.push(command);
    else {
      this.commands.splice(index + 1, 0, command);
    }
    const next = this.commands[index];
    //if (next) {
    next.update(prev.endpoint);
    //}

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
        const cp1 = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y), CONTROLPOINTZ, 'green', true);
        const cp2 = new PathPoint(new Vector2(this.moreposition.x + 0.2, this.moreposition.y), CONTROLPOINTZ, 'green', true);
        const to = new PathPoint(new Vector2(this.moreposition.x + 0.3, this.moreposition.y));
        this.addcommand(new CubicCurveCommand(cp1, cp2, to));
        this.points.push(cp1);
        this.points.push(cp2);
        this.addpoint(to);
      }
    },
    {
      text: 'Bezier Curve to', keycode: 'Q', icon: '', enabled: true, selected: () => {
        const cp = new PathPoint(new Vector2(this.moreposition.x + 0.1, this.moreposition.y), CONTROLPOINTZ, 'green', true);
        const to = new PathPoint(new Vector2(this.moreposition.x + 0.2, this.moreposition.y));
        this.addcommand(new QuadraticCurveCommand(cp, to));
        this.points.push(cp);
        this.addpoint(to);
      }
    },
    { text: 'Elliptical Arc', keycode: 'A', icon: '', enabled: true, selected: () => { } },
    {
      text: 'Close Path', keycode: 'Z', icon: '', enabled: true, selected: () => {
        if (this.commands.length > 1) {
          const point = new PathPoint(new Vector2(this.moveto.position.x, this.moveto.position.y), CLOSEPATHZ, 'black');
          this.addcommand(new ClosePathCommand(this.moveto, point));
          this.addpoint(point);
        }
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
          if (command instanceof CubicCurveCommand) {
            this.points = this.points.filter(x => x != command.cp1);
            this.points = this.points.filter(x => x != command.cp2);
          }
          else if (command instanceof QuadraticCurveCommand) {
            this.points = this.points.filter(x => x != command.cp);
          }

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

  scale = 0.5;

  morepressed() {
    this.menuposition.x = this.moreposition.x + 0.05;
    this.menuposition.y = this.moreposition.y;

    this.actionposition.x = this.moreposition.x + 0.05;
    this.actionposition.y = this.moreposition.y - 0.15;

    this.showmenu = true;
  }

  closemenus() {
    this.showmore = this.showmenu = this.showactions = false;
  }

  changelast(item: PathPoint) {
    if (!item.control)
      this.last = item;
    //console.warn('last updated')
  }

  startdrag(point: PathPoint) {
    //console.warn('start dragging')
    this.dragging = point;
    this.showmenu = this.showactions = false;
  }

  enddrag() {
    if (this.dragging) {
      this.moreposition.x = this.dragging.position.x;
      this.moreposition.y = this.dragging.position.y;

      if (!this.dragging.control) {
        const timer = setTimeout(() => {
          this.showmore = true;
          clearTimeout(timer)
        }, 100)
      }

      this.dragging = undefined;
      //console.warn('end dragging')
    }
  }

  moveto = new PathPoint(new Vector2(0, 0), MOVETOZ, 'red');

  constructor(
    private cameraman: CameraService
  ) {
    this.cameraman.position = [0, 0, 2];

    this.commands.push(new MoveToCommand(this.moveto));
    this.points.push(this.moveto);
    this.last = this.moveto;

    this.updateFlag = true;
  }

  hit(event: Intersection) {
    if (this.dragging) {
      let x = event.point.x;
      let y = event.point.y - this.yoffset;

      if (this.params.snap) {
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


  lathegeometry!: BufferGeometry;
  lathecolor = 'red';

  updatelathe() {
    if (this.params.showshape && this.commands.length > 2) {
      this.lathegeometry = new LatheGeometry(this.getpoints());
      this.lathegeometry.center();
    }
    else
      this.extrudegeometry = new BufferGeometry();
  }

  extrudegeometry!: BufferGeometry;
  extrudecolor = 'red';

  extrudeoptions: ExtrudeGeometryOptions = {
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
  }

  getpoints(): Array<Vector2>{
    const points: Array<Vector2> = []
    this.commands.forEach(command => {
      if (command.points)
        points.push(...command.points);
    });
    return points;
  }

  getshape(): Shape {
    return new Shape(this.getpoints());
  }

  updateextrude() {
    if (this.params.showshape && this.commands.length > 2) {
      this.extrudegeometry = new ExtrudeGeometry(this.getshape(), this.extrudeoptions);
      this.extrudegeometry.center();
    }
    else 
      this.extrudegeometry = new BufferGeometry();
  }

  shapegeometry!: BufferGeometry;

  updateshape() {
    if (this.params.showshape && this.commands.length > 2)
      this.shapegeometry = new ShapeGeometry(this.getshape());
    else
      this.shapegeometry = new BufferGeometry();
  }

  public pathgui!: Ng3GUI;
  public extrudegui!: Ng3GUI;
  public lathegui!: Ng3GUI;

  params = {
    snap: true,
    showshape: true,
    path: '',
    showpoints: true,
    tilt: false
  }


  ngOnInit() {
    let gui = new Ng3GUI({ width: 300 }).settitle('Path Settings');
    gui.add(this.params, 'snap').name('Snap to Grid');
    gui.add(this.params, 'showshape').name('Show Filled Shape').onChange(() => this.updateshape());
    gui.add(this.params, 'showpoints').name('Show Points');
    gui.addTextArea(this.params, 'path', 1.1, 0.35).name('Path').disable()
    //gui.add(this.params, 'tilt').name('Tilt Grid Forward');

    this.pathgui = gui;

    gui = new Ng3GUI({ width: 300 }).settitle('Extrude Settings');
    gui.add(this.extrudeoptions, 'depth', 0.01, 0.1, 0.01).name('Depth').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelEnabled').name('Enable Bevel').onChange(() => { this.updateextrude() });
    gui.addColor(this, 'extrudecolor').name('Color');

    this.extrudegui = gui;

    gui = new Ng3GUI({ width: 300 }).settitle('Lathe Settings');
    gui.addColor(this, 'lathecolor').name('Color');

    this.lathegui = gui;

    this.timer = setInterval(() => {
      this.redraw();
    }, 1000 / 30);
  }

  curves: Array<BufferGeometry> = [];
  controllines: Array<BufferGeometry> = [];

  drawshape() {
    this.curves.length = this.controllines.length = 0;

    const paths: Array<string> = [];

    let from = this.commands[0].endpoint;
    this.commands.forEach(command => {
      paths.push(command.path);

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
    this.updateshape();
    this.updateextrude();
    this.updatelathe();

    this.params.path = paths.join(' ');
  }

  tick(mesh: Mesh) {
    mesh.rotation.y += 0.01;
  }
}
