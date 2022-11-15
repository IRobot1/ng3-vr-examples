import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { Mesh, MeshBasicMaterial, Vector3 } from "three";
import { make, NgtObjectProps, NgtVector3 } from "@angular-three/core";

export interface SankeyValue {
  value: number;
  link: string;
}

export interface SankeyNodeData {
  position: NgtVector3; // center of rectangle
  width: number;
  height: number;
  inputs: Array<SankeyValue>;  // value is percentage of height 0 to 1
  outputs: Array<SankeyValue>; // value is percentage of height 0 to 1
  material: MeshBasicMaterial;
}

export interface SankeyPinEvent {
  size: number; // fraction of total value
  center: Vector3;  // center of pin, sized relative to height
  link: string;
  isinput: boolean;
}

@Component({
  selector: 'sankey-node',
  exportAs: 'sankeyNode',
  templateUrl: './sankey-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SankeyNode extends NgtObjectProps<Mesh> implements SankeyNodeData {
  @Input() width = 0.1;
  @Input() height = 0.4;
  @Input() material!: MeshBasicMaterial;

  private _inputs: Array<SankeyValue> = [];
  @Input()
  get inputs(): Array<SankeyValue> { return this._inputs }
  set inputs(newvalue: Array<SankeyValue>) {
    this._inputs = newvalue;
    if (!newvalue.length) return;

    const total = newvalue.map(item => item.value).reduce((accum, curr) => accum + curr);

    const position = make(Vector3, this.position).clone();
    position.x -= this.width / 2;

    let next = 0//-this.height/2;
    newvalue.forEach(item => {
      const fraction = item.value / total;

      position.y = next + (fraction * this.height) / 2;

      const event: SankeyPinEvent = { center: position, link: item.link, size: fraction /2, isinput: true }
      console.warn(event)
      this.valuechange.next(event)

      next += fraction * this.height;
    });
  }

  private _outputs: Array<SankeyValue> = [];
  @Input()
  get outputs(): Array<SankeyValue> { return this._outputs }
  set outputs(newvalue: Array<SankeyValue>) {
    this._outputs = newvalue;
    if (!newvalue.length) return;

    const total = newvalue.map(item => item.value).reduce((accum, curr) => accum + curr);

    const position = make(Vector3, this.position).clone();
    position.x += this.width / 2;

    let next = -this.height / 2;
    newvalue.forEach(item => {
      const fraction = item.value / total;
      position.y = next + (fraction * this.height) / 2;
      this.valuechange.next({ center: position, link: item.link, size: fraction, isinput: false })
      next += fraction * this.height;
    });
  }

  @Output() valuechange = new EventEmitter<SankeyPinEvent>();
}
