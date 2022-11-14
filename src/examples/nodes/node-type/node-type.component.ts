import { ChangeDetectionStrategy, Component, Input, OnInit, Optional } from "@angular/core";

import { Material } from "three";

import { FlatUINodePin } from "../node-pin/node-pin.component";

export interface NodeType {
  name: string;
  icon: string;
  material: Material;
}

@Component({
  selector: 'flat-ui-node-type',
  exportAs: 'flatUINodeType',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUINodeType implements OnInit, NodeType {
  @Input() name!: string;
  @Input() icon!: string;
  @Input() material!: Material;

  constructor(
    @Optional() private node: FlatUINodePin,
  ) { }

  ngOnInit(): void {
    if (!this.node) return;

    this.node.type = this;
  }
}
