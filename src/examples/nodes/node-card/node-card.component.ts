import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps, NgtTriple } from "@angular-three/core";

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
  @Input() inputs: Array<NodePin> = [];
  @Input() outputs: Array<NodePin> = [];
  @Input() width = 1;
  @Input() height = 1;

  @Input() selectable?: InteractiveObjects;

  addinput(input: NodePin): number {
    return this.inputs.push(input);
  }

  removeinput(input: NodePin) {
    this.inputs = this.inputs.filter(item => item != input);
  }

  addoutput(output: NodePin): number {
    return this.outputs.push(output);
  }

  removeoutput(output: NodePin) {
    this.outputs = this.outputs.filter(item => item != output);
  }
}
