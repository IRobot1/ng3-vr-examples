import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, Material, Mesh, PlaneGeometry, Shape } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface BlockConsoleEvent {
  screenheight: number;
  screenangle: number;
}

@Component({
  selector: 'block-console',
  exportAs: 'blockConsole',
  templateUrl: './block-console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockConsole extends NgtObjectProps<Mesh> {
  private _height = 1;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.updateFlag = true;
  }

  private _width = 1;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    this.updateFlag = true;
  }

  private _depth = 0.8;
  @Input()
  get depth(): number { return this._depth }
  set depth(newvalue: number) {
    this._depth = newvalue;
    this.updateFlag = true;
  }

  private _shelf = 0.2;
  @Input()
  get shelf(): number { return this._shelf }
  set shelf(newvalue: number) {
    this._shelf = newvalue;
    this.updateFlag = true;
  }

  private _screenheight = 0.6;
  @Input()
  get screenheight(): number { return this._screenheight }
  set screenheight(newvalue: number) {
    this._screenheight = newvalue;
    this.updateFlag = true;
  }

  @Input() material!: Material;

  @Output() screen = new EventEmitter<BlockConsoleEvent>();

  protected geometry!: BufferGeometry;

  private refresh() {
    const shape = new Shape()
      .moveTo(0, 0)
      .lineTo(-this.depth, 0)
      .lineTo(-this.depth, this.height)
      .lineTo(-this.depth + this.shelf, this.height)
      .lineTo(0, this.screenheight)

    this.geometry = new ExtrudeGeometry(shape, { bevelEnabled: false, depth: this.width });
    this.geometry.translate(0, 0, -this.width / 2)

    const a = this.depth - this.shelf;
    const b = this.height - this.screenheight;

    const screenheight = Math.sqrt(a * a + b * b);
    const screenangle = Math.asin(a / screenheight);

    const event: BlockConsoleEvent = { screenheight, screenangle };
    this.screen.next(event);
  }

  private updateFlag = true;

  tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}
