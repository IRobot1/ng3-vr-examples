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
  @Input() height = 1;
  @Input() width = 1;
  @Input() depth = 0.8;
  @Input() shelf = 0.2;
  @Input() screenheight = 0.6;
  @Input() material!: Material;

  @Output() screen = new EventEmitter<BlockConsoleEvent>();

  protected geometry!: BufferGeometry;

  override ngOnInit() {
    super.ngOnInit();

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
}
