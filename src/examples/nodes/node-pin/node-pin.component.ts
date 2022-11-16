import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Optional, Output } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { FlatUINodeCard } from "../node-card/node-card.component";
import { NodeType } from "../node-type/node-type.component";



export interface NodePin {
  seqnum: number;
  type: NodeType;
  name: string;
  value?: any;
}


@Component({
  selector: 'flat-ui-node-pin',
  exportAs: 'flatUINodePin',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUINodePin implements OnInit, NodePin {
  @Input() input = true;
  @Input() seqnum = -1;
  @Input() type!: NodeType;
  @Input() name = 'pin';
  @Input() value?: any;

  @Output() change = new EventEmitter<NodePin>();

  constructor(
    @Optional() private node: FlatUINodeCard,
  ) { }

  ngOnInit(): void {
    if (!this.node) return;

    if (this.input)
      this.node.addinput(this);
    else
      this.node.addoutput(this);
  }
}
