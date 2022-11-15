import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { Color, MeshBasicMaterial } from "three";
import { NgtTriple } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

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
  selectable = new InteractiveObjects();

  column1: Array<SankeyNodeData> = [];
  column2: Array<SankeyNodeData> = [];

  links: Array<SankeyLink> = [];

  constructor(private cd: ChangeDetectorRef) { }

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
    if (link.start && link.end) this.cd.detectChanges();
  }

  ngOnInit(): void {
    let next = 0;
    let padding = 0.02;

    for (let i = 1; i < 11; i++) {
      const height = Math.max(0.1, 0.4 * Math.random());

      const node1: SankeyNodeData = {
        position: [0, next + height / 2 + padding, 0.001 * i],
        width: 0.1,
        height: height,
        inputs: [],
        outputs: [{ link: `${i}-${i}`, value: height / 4 }],
        material: new MeshBasicMaterial({ color: '#' + new Color(Math.random() * 0xffffff).getHexString() }),
      }
      this.column1.push(node1)

      const node2: SankeyNodeData = {
        position: [1, next + height / 2 + padding, 0.001 * i],
        width: 0.1,
        height: node1.height,
        inputs: [{ link: `${i}-${i}`, value: height / 4 }],
        outputs: [],
        material: node1.material,
      }
      this.column2.push(node2);

      next += height + padding;
    }
  }
}
