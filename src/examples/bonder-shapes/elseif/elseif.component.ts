import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, Shape, ShapeGeometry, Vector2 } from "three";

import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'elseif-shape',
  exportAs: 'elseIfShape',
  templateUrl: './elseif.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class ElseIfShapeComponent extends NgtObjectProps<Mesh>{

  private _width = 0.8;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 0.8) newvalue = 0.8;

    this._width = newvalue;
    this.updateFlag = true;
  }

  private _ifheight = 0;
  @Input()
  get ifheight(): number { return this._ifheight }
  set ifheight(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 0) newvalue = 0;

    this._ifheight = newvalue;
    this.updateFlag = true;
  }

  private _elseheight = 0;
  @Input()
  get elseheight(): number { return this._elseheight }
  set elseheight(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 0) newvalue = 0;

    this._elseheight = newvalue;
    this.updateFlag = true;
  }

  @Input() showelse = false;

  @Input() material!: Material;

  @Output() heightchange = new EventEmitter<number>();

  protected geometry!: BufferGeometry;
  private updateFlag = true;

  private makeGeometry() {
    const points: Array<Vector2> = []
    points.push(new Vector2(0, 0))
    points.push(new Vector2(0.1, 0))
    points.push(new Vector2(0.2, -0.1))
    points.push(new Vector2(0.4, -0.1))
    points.push(new Vector2(0.5, 0))
    points.push(new Vector2(this.width, 0))
    points.push(new Vector2(this.width, -0.4))
    points.push(new Vector2(0.6, -0.4))
    points.push(new Vector2(0.5, -0.5))
    points.push(new Vector2(0.3, -0.5))
    points.push(new Vector2(0.2, -0.4))
    points.push(new Vector2(0.1, -0.4))

    points.push(new Vector2(0.1, -0.6 - this.ifheight))
    points.push(new Vector2(0.2, -0.6 - this.ifheight))
    points.push(new Vector2(0.3, -0.7 - this.ifheight))
    points.push(new Vector2(0.5, -0.7 - this.ifheight))
    points.push(new Vector2(0.6, -0.6 - this.ifheight))
    points.push(new Vector2(this.width, -0.6 - this.ifheight))
    points.push(new Vector2(this.width, -1 - this.ifheight))

    const offset = this.showelse ? 0.1 : 0

    points.push(new Vector2(0.5 + offset, -1 - this.ifheight))
    points.push(new Vector2(0.4 + offset, -1.1 - this.ifheight))
    points.push(new Vector2(0.2 + offset, -1.1 - this.ifheight))
    points.push(new Vector2(0.1 + offset, -1 - this.ifheight))
    points.push(new Vector2(0.1, -1 - this.ifheight))

    if (!this.showelse) {
      points.push(new Vector2(0, -1 - this.ifheight))
      this.heightchange.next(1 + this.ifheight);
    }
    else {
      points.push(new Vector2(0.1, -1 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.1, -1.2 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.2, -1.2 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.3, -1.3 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.5, -1.3 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.6, -1.2 - this.ifheight - this.elseheight))
      points.push(new Vector2(this.width, -1.2 - this.ifheight - this.elseheight))
      points.push(new Vector2(this.width, -1.6 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.5, -1.6 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.4, -1.7 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.2, -1.7 - this.ifheight - this.elseheight))
      points.push(new Vector2(0.1, -1.6 - this.ifheight - this.elseheight))
      points.push(new Vector2(0, -1.6 - this.ifheight - this.elseheight))

      this.heightchange.next(1.6 + this.ifheight + this.elseheight)
    }

    const shape = new Shape(points);
    this.geometry = new ShapeGeometry(shape);
  }


  protected draw() {
    if (this.updateFlag) {
      this.makeGeometry();
      this.updateFlag = false;
    }
  }
}
