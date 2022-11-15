import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { Mesh, MeshBasicMaterial, Vector3 } from "three";
import { make, NgtEvent, NgtObjectProps, NgtVector3 } from "@angular-three/core";

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
    this.notify(newvalue, true, make(Vector3, this.position).clone())
  }

  private _outputs: Array<SankeyValue> = [];
  @Input()
  get outputs(): Array<SankeyValue> { return this._outputs }
  set outputs(newvalue: Array<SankeyValue>) {
    this._outputs = newvalue;
    this.notify(newvalue, false, make(Vector3, this.position).clone())
  }

  @Output() valuechange = new EventEmitter<SankeyPinEvent>();

  private notify(newvalue: Array<SankeyValue>, isinput: boolean, position: Vector3) {
    if (!newvalue.length) return;

    const total = newvalue.map(item => item.value).reduce((accum, curr) => accum + curr);

    if (isinput)
      position.x -= this.width / 2;
    else
      position.x += this.width / 2;

    let nexty = position.y - this.height / 2; // start at bottom of card

    newvalue.forEach(item => {
      const fractionoftotal = item.value / total;
      const fractionofheight = this.height * fractionoftotal;

      position.y = nexty + fractionofheight / 2;

      const event: SankeyPinEvent = { center: position, link: item.link, size: fractionofheight / 2, isinput: isinput }
      this.valuechange.next(event)

      nexty += fractionofheight;
    });
  }

  protected cardmoved(position: Vector3) {
    this.notify(this.inputs, true, position)
    this.notify(this.outputs, false, position)
  }
}
