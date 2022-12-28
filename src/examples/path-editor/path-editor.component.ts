import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, Intersection, LatheGeometry, Mesh, Shape, ShapeGeometry, Vector2, Vector3 } from "three";

import { InteractiveObjects, MenuItem } from "ng3-flat-ui";
import { BaseCommand, ClosePathCommand, CLOSEPATHZ, CommandData, CommandType, ControlPoint, CONTROLPOINTZ, CubicCurveCommand, GUIZ, HorizontalCommand, LineToCommand, MENUZ, MoveToCommand, MOVETOZ, PathPoint, POINTZ, QuadraticCurveCommand, SHAPEZ, VerticalCommand } from "./path-util";
import { CameraService } from "../../app/camera.service";

import { Ng3GUI } from "ng3-gui";
import { label1, label10, label11, label12, label2, label3, label4, label5, label6, label7, label8, label9, lathe1, lathe2 } from "./path-examples";
import { Exporter } from "../spriograph/export";

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

  showtranslate = false;

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

  moveto = new PathPoint(new Vector2(0, 0), MOVETOZ, 'red');

  addmoveto(x: number, y: number) {
    this.moveto.position.x = x;
    this.moveto.position.y = y;
    if (this.moveto.mesh) {
      this.moveto.mesh.position.x = x;
      this.moveto.mesh.position.y = y;
    }
    this.commands.push(new MoveToCommand(this.moveto));
    this.points.push(this.moveto);
    this.last = this.moveto;
  }

  addlineto(x: number, y: number) {
    const lineto = new PathPoint(new Vector2(x, y));
    this.addcommand(new LineToCommand(lineto));
    this.addpoint(lineto);
  }

  addvertical(x: number, y: number) {
    const vertical = new PathPoint(new Vector2(x, y));
    vertical.changex = false;
    this.addcommand(new VerticalCommand(vertical));
    this.addpoint(vertical);
  }

  addhorizontal(x: number, y: number) {
    const horizontal = new PathPoint(new Vector2(x, y));
    horizontal.changey = false;
    this.addcommand(new HorizontalCommand(horizontal));
    this.addpoint(horizontal);
  }

  addcubic(x: number, y: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number) {
    const cp1 = new PathPoint(new Vector2(cp1x, cp1y), CONTROLPOINTZ, 'green', true);
    const cp2 = new PathPoint(new Vector2(cp2x, cp2y), CONTROLPOINTZ, 'green', true);
    const to = new PathPoint(new Vector2(x, y));
    this.addcommand(new CubicCurveCommand(cp1, cp2, to));
    this.points.push(cp1);
    this.points.push(cp2);
    this.addpoint(to);
  }

  addbezier(x: number, y: number, cpx: number, cpy: number) {
    const cp = new PathPoint(new Vector2(cpx, cpy), CONTROLPOINTZ, 'green', true);
    const to = new PathPoint(new Vector2(x, y));
    this.addcommand(new QuadraticCurveCommand(cp, to));
    this.points.push(cp);
    this.addpoint(to);
  }

  addclose(x: number, y: number) {
    const point = new PathPoint(new Vector2(x, y), CLOSEPATHZ, 'black');
    this.addcommand(new ClosePathCommand(this.moveto, point));
    this.addpoint(point);
  }

  actionmenu: Array<MenuItem> = [
    //{ text: 'M Move to', icon: '', enabled: true, selected: () => { } },
    {
      text: 'Line to', keycode: 'L', icon: '', enabled: true, selected: () => {
        this.addlineto(this.moreposition.x + 0.1, this.moreposition.y + 0.1);
      }
    },
    {
      text: 'Vertical Line to', keycode: 'V', icon: '', enabled: true, selected: () => {
        this.addvertical(this.moreposition.x, this.moreposition.y + 0.1)
      }
    },
    {
      text: 'Horizontal Line to', keycode: 'H', icon: '', enabled: true, selected: () => {
        this.addhorizontal(this.moreposition.x + 0.1, this.moreposition.y)
      }
    },
    {
      text: 'Cubic Curve to', keycode: 'C', icon: '', enabled: true, selected: () => {
        this.addcubic(this.moreposition.x + 0.3, this.moreposition.y, this.moreposition.x + 0.1, this.moreposition.y, this.moreposition.x + 0.2, this.moreposition.y)
      }
    },
    {
      text: 'Bezier Curve to', keycode: 'Q', icon: '', enabled: true, selected: () => {
        this.addbezier(this.moreposition.x + 0.2, this.moreposition.y, this.moreposition.x + 0.1, this.moreposition.y)
      }
    },
    /*    { text: 'Elliptical Arc', keycode: 'A', icon: '', enabled: true, selected: () => { } },*/
    {
      text: 'Close Path', keycode: 'Z', icon: '', enabled: true, selected: () => {
        if (this.commands.length > 1) {
          this.addclose(this.moveto.position.x, this.moveto.position.y)
        }
      }
    },
  ];

  translatemenu: Array<MenuItem> = [
    {
      text: 'Left', keycode: 'ArrowLeft', icon: 'west', enabled: true, selected: () => {
        const delta = new Vector2(-0.1, 0)
        this.points.forEach(point => { point.position.add(delta); point.mesh.position.x += delta.x; })
        this.updateFlag = true;
      }
    },
    {
      text: 'Right', keycode: 'ArrowRight', icon: 'east', enabled: true, selected: () => {
        const delta = new Vector2(0.1, 0)
        this.points.forEach(point => { point.position.add(delta); point.mesh.position.x += delta.x; })
        this.updateFlag = true;
      }
    },
    {
      text: 'Up', keycode: 'ArrowUp', icon: 'north', enabled: true, selected: () => {
        const delta = new Vector2(0, 0.1)
        this.points.forEach(point => { point.position.add(delta); point.mesh.position.y += delta.y; })
        this.updateFlag = true;
      }
    },
    {
      text: 'Down', keycode: 'ArrowDown', icon: 'south', enabled: true, selected: () => {
        const delta = new Vector2(0, -0.1)
        this.points.forEach(point => { point.position.add(delta); point.mesh.position.y += delta.y; })
        this.updateFlag = true;
      }
    },

    ]

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
    { text: 'Translate', keycode: 'T', icon: 'open_with', enabled: true, submenu: this.translatemenu, selected: () => { this.showtranslate = true } },
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


  constructor(
    private cameraman: CameraService
  ) {
    this.cameraman.position = [0, 0, 2];

    const json = localStorage.getItem('patheditor');
    if (json) {
      this.load(JSON.parse(json));
    }
    else {
      this.addmoveto(0, 0)
    }
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
    this.save();
  }


  lathegeometry!: BufferGeometry;

  latheparams = {
    color: 'red',
    segments: 12,
    animate: false,
  }

  updatelathe() {
    if (this.lathegeometry) this.lathegeometry.dispose();

    if (this.params.showshape && this.commands.length > 2) {
      this.lathegeometry = new LatheGeometry(this.getpoints(), this.latheparams.segments);
      this.lathegeometry.center();
    }
    else
      this.lathegeometry = new BufferGeometry();
  }

  extrudegeometry!: BufferGeometry;
  extrudeparams = {
    color: 'red',
    animate: false,
  }

  extrudeoptions: ExtrudeGeometryOptions = {
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 1,
    bevelOffset: 0,
  }

  getpoints(): Array<Vector2> {
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
    if (this.extrudegeometry) this.extrudegeometry.dispose();

    if (this.params.showshape && this.commands.length > 2) {
      this.extrudegeometry = new ExtrudeGeometry(this.getshape(), this.extrudeoptions);
      this.extrudegeometry.center();
    }
    else
      this.extrudegeometry = new BufferGeometry();
  }

  shapegeometry!: BufferGeometry;

  updateshape() {
    if (this.shapegeometry) this.shapegeometry.dispose();

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
    showlathe: false,
    showextrude: true,
    examples: -1,

    tilt: false
  }

  exampledata = [
    lathe1,
    label1,
    label2,
    label3,
    label4,
    label5,
    label6,
    label7,
    label8,
    label9,
    label10,
    label11,
    label12,
    lathe2,
  ]
  examples = {
    Lathe1: 0,
    Label1: 1,
    Label2: 2,
    Label3: 3,
    Label4: 4,
    Label5: 5,
    Label6: 6,
    Label7: 7,
    Label8: 8,
    Label9: 9,
    Label10: 10,
    Label11: 11,
    Label12: 12,
    Lathe2: 13,
  }

  protected extrudemesh!: Mesh;
  protected lathemesh!: Mesh;
  private filename = 'model';
  private count = 1;

  private saveply(mesh: Mesh) {
    const save = new Exporter()
    save.exportPLY(mesh, this.filename + this.count);
    this.count++;
  }

  saveextrudeply() {
    this.saveply(this.extrudemesh)
  }

  savelatheply() {
    this.saveply(this.lathemesh)
  }

  ngOnInit() {
    let gui = new Ng3GUI({ width: 300 }).settitle('Path Settings');
    gui.add(this.params, 'snap').name('Snap to Grid');
    gui.add(this.params, 'showshape').name('Show Filled Shape').onChange(() => this.updateshape());
    gui.add(this.params, 'showpoints').name('Show Points');
    gui.add(this.params, 'showextrude').name('Show Extrude Geometry');
    gui.add(this.params, 'showlathe').name('Show Lathe Geometry');
    gui.add(this.params, 'examples', this.examples).name('Examples').onChange(index => { this.load(this.exampledata[index]) });
    gui.add(this, 'newshape').name('New Shape')
    gui.add(this, 'threecode').name('Generate ThreeJS Code');
    gui.addTextArea(this.params, 'path', 1.1, 1).name('Path').disable()
    //gui.add(this.params, 'tilt').name('Tilt Grid Forward');

    this.pathgui = gui;

    gui = new Ng3GUI({ width: 300 }).settitle('Extrude Settings');
    gui.addColor(this.extrudeparams, 'color').name('Color');
    gui.add(this.extrudeoptions, 'depth', 0.01, 0.1, 0.01).name('Depth').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelEnabled').name('Enable Bevel').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelThickness', 0.01, 0.1, 0.01).name('Bevel Thickness').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelSize', 0.01, 0.1, 0.01).name('Bevel Size').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelSegments', 1, 5, 1).name('Bevel Segments').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeoptions, 'bevelOffset', -0.05, 0.05, 0.01).name('Bevel Offset').onChange(() => { this.updateextrude() });
    gui.add(this.extrudeparams, 'animate').name('Animate');
    gui.add(this, 'saveextrudeply').name('Save to PLY');


    this.extrudegui = gui;

    gui = new Ng3GUI({ width: 300 }).settitle('Lathe Settings');
    gui.addColor(this.latheparams, 'color').name('Color');
    gui.add(this.latheparams, 'segments', 3, 24, 1).name('Segments').onChange(() => { this.updatelathe() });;
    gui.add(this.latheparams, 'animate').name('Animate');
    gui.add(this, 'savelatheply').name('Save to PLY');

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

  tick(mesh: Mesh, animate: boolean) {
    if (animate)
      mesh.rotation.y += 0.01;
  }

  newshape() {
    this.commands.length = this.controls.length = this.points.length = 0;
    this.updateextrude();
    this.updatelathe();
    this.updateshape();
    this.addmoveto(0, 0);
    this.updateFlag = true;
  }

  load(commands: Array<CommandData>) {
    this.commands.length = this.controls.length = this.points.length = 0;

    commands.forEach(command => {
      switch (command.type) {
        case 'moveto':
          this.addmoveto(command.x, command.y)
          break;
        case 'lineto':
          this.addlineto(command.x, command.y);
          break;
        case 'vertical':
          this.addvertical(command.x, command.y);
          break;
        case 'horizontal':
          this.addhorizontal(command.x, command.y);
          break;
        case 'cubic':
          this.addcubic(command.x, command.y, command.cpx ?? command.x, command.cpy ?? command.y, command.cp2x ?? command.x, command.cp2y ?? command.y);
          break;
        case 'quadratic':
          this.addbezier(command.x, command.y, command.cpx ?? command.x, command.cpy ?? command.y);
          break;
        case 'closepath':
          this.addclose(command.x, command.y);
          break;
      }
    });
  }

  save() {
    const commands = this.commands.map(command => {
      const result: CommandData = { type: command.type, x: command.endpoint.position.x, y: command.endpoint.position.y }

      if (command instanceof CubicCurveCommand) {
        result.cpx = command.cp1.position.x;
        result.cpy = command.cp1.position.y;
        result.cp2x = command.cp2.position.x;
        result.cp2y = command.cp2.position.y;
      }
      else if (command instanceof QuadraticCurveCommand) {
        result.cpx = command.cp.position.x;
        result.cpy = command.cp.position.y;
      }
      return result;
    });

    localStorage.setItem('patheditor', JSON.stringify(commands))
  }

  threecode() {
    const lines: Array<string> = [];
    lines.push(`const points: Array<Vector2> = [`)
    const points = this.getpoints();
    points.forEach(point => { lines.push(`new Vector2(${point.x}, ${point.y}),`) })
    lines.push(`]`)
    lines.push(`const shape = new Shape(points);`)
    lines.push(`const geometry = new ShapeGeometry(shape);`)

    const code = lines.join('\n');
    const save = new Exporter()
    save.saveString(code, 'shape' + this.count, 'text/javascript');
    this.count++;
  }

}
