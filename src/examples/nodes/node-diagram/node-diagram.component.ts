import { Input , ChangeDetectionStrategy, Component } from "@angular/core";

import { Group, MeshBasicMaterial, Object3D } from "three";
import { NgtObjectProps, NgtTriple } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";
import { NodeType } from "../node-type/node-type.component";
import { NodePin } from "../node-pin/node-pin.component";
import { NodeCard, NodePinEvent, PIN_MOVED_EVENT } from "../node-card/node-card.component";
import { NodeLink } from "../node-link/node-link.component";

interface NodeCardData extends NodeCard {
  position: NgtTriple;
}


@Component({
  selector: 'flat-ui-node-diagram',
  exportAs: 'flatUINodeDiagram',
  templateUrl: './node-diagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUINodeDiagram extends NgtObjectProps<Group>  {
  @Input() selectable?: InteractiveObjects;

  group!: Group;
  groupready(group: Group) {
    this.group = group;
    this.ready.next(group);
  }


  protected links: Array<NodeLink> = [];

  stringtype: NodeType = { name: 'string', icon: 'circle', material: new MeshBasicMaterial({ color: 'red' }) }
  numbertype: NodeType = { name: 'number', icon: 'circle', material: new MeshBasicMaterial({ color: 'lime' }) }
  colortype: NodeType = { name: 'color', icon: 'circle', material: new MeshBasicMaterial({ color: 'magenta' }) }
  checktype: NodeType = { name: 'checkbox', icon: 'circle', material: new MeshBasicMaterial({ color: 'cornflowerblue' }) }

  nodetypes: Array<NodeType> = [
    this.stringtype, this.numbertype, this.colortype, this.checktype
  ]

  inputs: Array<NodePin> = [
    { seqnum: 1, name: 'string', type: this.stringtype, value: 'test', link: '' },
    { seqnum: 2, name: 'number', type: this.numbertype, value: '1', link: '' },
  ]

  outputs: Array<NodePin> = [
    { seqnum: 1, name: 'color', type: this.colortype, value: 'test', link: '' },
    { seqnum: 2, name: 'check', type: this.checktype, value: false, link: '' },
  ]

  cards: Array<NodeCardData> = [
    {
      title: 'Card1', width: 1, height: 1, position: [-1.5, 1.3, 0.003], inputs: [], outputs: [
        { seqnum: 1, name: 'color', type: this.colortype, value: 'test', link: 'c1c2' },
      ]
    },
    {
      title: 'Card2', width: 1, height: 1, position: [0, 1.3, 0.006], outputs: [],
      inputs: [
        { seqnum: 1, name: 'color', type: this.colortype, value: 'test', link: 'c1c2' },
      ],
    },
    //{ title: 'Card3', width: 1, height: 1, inputs: this.inputs, outputs: this.outputs, position: [1.5, 1.3, 0.009] },
  ]

  updatelink(change: NodePinEvent) {
    let link = this.links.find(item => item.name == change.link);
    if (!link) {
      link = { name: change.link, size: 0.02 }
      this.links.push(link);
    }

    if (change.isinput)
      link.end = change.position.toArray();
    else {
      link.start = change.position.toArray();
    }
    //if (link.start && link.end) this.cd.detectChanges();
    //console.warn(this.links)
  }

  cardready(card: Object3D) {
    card.addEventListener(PIN_MOVED_EVENT, (e: any) => {
      this.updatelink(e)
    })
  }


  //ngOnInit(): void {
  //  setTimeout(() => {
  //    this.outputs.push({ seqnum: 3, name: 'color', type: this.colortype, value: 'black', link: '' });
  //  }, 2000)
  //}

}
