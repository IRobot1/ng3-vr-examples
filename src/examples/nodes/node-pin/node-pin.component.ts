import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { NodeType } from "../node-type/node-type.component";



export interface NodePin {
  seqnum: number;
  type: NodeType;
  name: string;
  value?: any;
  link: string;

  // pin mesh added at runtime
  object?: Group;
}


@Component({
  selector: 'flat-ui-node-pin',
  exportAs: 'flatUINodePin',
  templateUrl: 'node-pin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUINodePin extends NgtObjectProps<Group> implements NodePin {
  @Input() input = true;
  @Input() seqnum = -1;
  @Input() type!: NodeType;
  @Input() value?: any;
  @Input() link = '';
    object?: Group;

  //@Output() change = new EventEmitter<NodePin>();

  pinready(object: Group) {
    this.ready.next(object);
  }
}
