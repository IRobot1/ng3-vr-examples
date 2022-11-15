import { NgtTriple } from "@angular-three/core";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Color, MeshBasicMaterial, Vector3 } from "three";

import { SankeyNodeData, SankeyPinEvent } from "./sankey-node/sankey-node.component";

interface SankeyLink {
  name: string;
  start?: NgtTriple;
  end?: NgtTriple;
  size: number;
}

@Component({
  templateUrl: './sankey.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SankeyExample implements OnInit {
  column1: Array<SankeyNodeData> = [];
  column2: Array<SankeyNodeData> = [];

  links: Array<SankeyLink> = [];

  updatelink(change: SankeyPinEvent) {
    let link = this.links.find(item => item.name == change.link);
    if (!link) {
      link = { name: change.link, size: change.size }
      this.links.push(link);
    }
    else {
      link.size = change.size;
    }
    if (change.isinput)
      link.end = change.center.toArray();
    else {
      link.start = change.center.toArray();
    }
  }

  ngOnInit(): void {
    let next = 0;
    let padding = 0.02;

    for (let i = 0; i < 10; i++) {
      const height = 0.4 * Math.random();

      const node1: SankeyNodeData = {
        position: [0, next + height / 2 + padding, 0],
        width: 0.1,
        height: height,
        inputs: [],
        outputs: [{ link: `${i}-${i}`, value: height/4}],
        material: new MeshBasicMaterial({ color: '#' + new Color(Math.random() * 0xffffff).getHexString() }),
      }
      this.column1.push(node1)

      const node2: SankeyNodeData = {
        position: [1, next + height / 2 + padding, 0],
        width: 0.1,
        height: node1.height,
        inputs: [{ link: `${i}-${i}`, value: height/4 }],
        outputs: [],
        material: node1.material,
      }
      this.column2.push(node2);

      next += height + padding;
    }
  }
}
