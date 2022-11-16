import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from "@angular/core";

import { MeshBasicMaterial } from "three";
import { NgtTriple } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { NodePin } from "./node-pin/node-pin.component";
import { NodeType } from "./node-type/node-type.component";
import { NodeCard } from "./node-card/node-card.component";

interface NodeCardData extends NodeCard {
  position: NgtTriple;
}

@Component({
  templateUrl: './nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesExample implements OnInit {
  selectable = new InteractiveObjects();

  stringtype: NodeType = { name: 'string', icon: 'circle', material: new MeshBasicMaterial({ color: 'red' }) }
  numbertype: NodeType = { name: 'number', icon: 'circle', material: new MeshBasicMaterial({ color: 'lime' }) }
  colortype: NodeType = { name: 'color', icon: 'circle', material: new MeshBasicMaterial({ color: 'magenta' }) }
  checktype: NodeType = { name: 'checkbox', icon: 'circle', material: new MeshBasicMaterial({ color: 'cornflowerblue' }) }

  nodetypes: Array<NodeType> = [
    this.stringtype, this.numbertype, this.colortype, this.checktype
  ]

  inputs: Array<NodePin> = [
    { seqnum: 1, name: 'string', type: this.stringtype, value: 'test' },
    { seqnum: 2, name: 'number', type: this.numbertype, value: '1' },
  ]

  outputs: Array<NodePin> = [
    { seqnum: 1, name: 'color', type: this.colortype, value: 'test' },
    { seqnum: 2, name: 'check', type: this.checktype, value: false },
  ]

  cards: Array<NodeCardData> = [
    { title: 'Card1', width: 1, height: 1, inputs: this.inputs, outputs: this.outputs, position: [-1.5, 1.3, 0.003] },
    { title: 'Card2', width: 1, height: 1, inputs: this.inputs, outputs: this.outputs, position: [0, 1.3, 0.006] },
    { title: 'Card3', width: 1, height: 1, inputs: this.inputs, outputs: this.outputs, position: [1.5, 1.3, 0.009] },
  ]

  ngOnInit(): void {
    setTimeout(() => {
      this.outputs.push({ seqnum: 3, name: 'color', type: this.colortype, value: 'black' });
    }, 2000)
  }

}
