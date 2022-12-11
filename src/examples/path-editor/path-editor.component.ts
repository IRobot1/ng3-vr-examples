import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, Intersection, Mesh, Vector2 } from "three";

import { InteractiveObjects } from "ng3-flat-ui";
import { BaseCommand, HorizontalCommand, LineToCommand, MoveToCommand, PathPoint, VerticalCommand } from "./path-util";

@Component({
  templateUrl: './path-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathEditorExample implements OnInit, OnDestroy {
  selectable = new InteractiveObjects();

  dragging?: PathPoint;

  startdrag(point: PathPoint) {
    //console.warn('start dragging')
    this.dragging = point;
  }
  enddrag() {
    //console.warn('end dragging')
    this.dragging = undefined;
  }

  commands: Array<BaseCommand> = [];

  points: Array<PathPoint> = [];

  constructor() {
    let moveto = new PathPoint(new Vector2(0, 0), 'red');
    this.commands.push(new MoveToCommand(moveto, moveto));
    this.points.push(moveto);

    const lineto = new PathPoint(new Vector2(1, 0));
    this.commands.push(new LineToCommand(moveto, lineto));
    this.points.push(lineto);

    const vertical = new PathPoint(new Vector2(1, 1));
    vertical.changex = false;
    this.commands.push(new VerticalCommand(lineto, vertical));
    this.points.push(vertical);

    const horizontal = new PathPoint(new Vector2(0, 1));
    horizontal.changey = false;
    this.commands.push(new HorizontalCommand(vertical, horizontal));
    this.points.push(horizontal);

    this.updateFlag = true;

  }

  snap = true;
  hit(event: Intersection) {
    if (this.dragging) {
      let x = event.point.x;
      let y = event.point.y - 1.5;

      if (this.snap) {
        x = Math.round(x / 0.1) * 0.1;
        y = Math.round(y / 0.1) * 0.1;
      }

      if (x != this.dragging.position.x || y != this.dragging.position.y) {
        if (this.dragging.changex)
          this.dragging.position.x = this.dragging.mesh.position.x = x;
        if (this.dragging.changey)
        this.dragging.position.y = this.dragging.mesh.position.y = y;

        //const commands = this.commands.filter(x => x.from == this.dragging || x.to == this.dragging);
        //console.warn(commands)

        this.commands.forEach(command => command.update());

        this.updateFlag = true;
      }
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

  drawshape() {
    this.curves.length = 0;
    this.commands.forEach(command => {
      let target = command.from.mesh.position;
      let source = command.from.position;
      target.set(source.x, source.y, 0.001);

      if (command.from != command.to) {
        target = command.to.mesh.position;
        source = command.to.position;
        target.set(source.x, source.y, 0.001);
      }

      if (command.geometry) this.curves.push(command.geometry);
    });
  }
}
