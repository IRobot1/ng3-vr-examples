import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { NodePin } from "../node-pin/node-pin.component";

export interface NodeCard {
  title: string;
  inputs: Array<NodePin>;
  outputs: Array<NodePin>;
  width: number;
  height: number;
}

@Component({
  selector: 'flat-ui-node-card',
  exportAs: 'flatUINodeCard',
  templateUrl: './node-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUINodeCard extends NgtObjectProps<Group> implements NodeCard {
  @Input() title = 'node';
  @Input() width = 1;
  @Input() height = 1;

  @Input() preview = false;
  @Input() inputexec = false;
  @Input() outputexec = false;

  previewwidth = 0.4;
  previewheight = 0.4;


  private _inputs: Array<NodePin> = [];
  @Input()
  get inputs(): Array<NodePin> { return this._inputs }
  set inputs(newvalue: Array<NodePin>) {
    this._inputs = newvalue.sort((a, b) => a.seqnum - b.seqnum);
  }

  private _outputs: Array<NodePin> = [];
  @Input()
  get outputs(): Array<NodePin> { return this._outputs }
  set outputs(newvalue: Array<NodePin>) {
    this._outputs = newvalue.sort((a, b) => a.seqnum - b.seqnum);
  }

  @Input() selectable?: InteractiveObjects;

  addinput(input: NodePin): number {
    const seqnum = this.inputs.push(input);
    if (input.seqnum <= 0) input.seqnum = seqnum;
    return seqnum;
  }

  removeinput(input: NodePin) {
    this.inputs = this.inputs.filter(item => item != input);
  }

  addoutput(output: NodePin): number {
    const seqnum = this.outputs.push(output);
    if (output.seqnum <= 0) output.seqnum = seqnum;
    return seqnum;
  }

  removeoutput(output: NodePin) {
    this.outputs = this.outputs.filter(item => item != output);
  }
}
