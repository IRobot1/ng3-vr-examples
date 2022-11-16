import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { Color, MeshBasicMaterial } from "three";
import { NgtTriple } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { SankeyNodeData, SankeyPinEvent } from "./sankey-node/sankey-node.component";
import { loadenergy } from "./sankey-energy";

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
  private nodes: Array<SankeyNodeData> = [];

  protected selectable = new InteractiveObjects();

  protected columns: Array<Array<SankeyNodeData>> = [];
  protected links: Array<SankeyLink> = [];

  constructor(private cd: ChangeDetectorRef) { }

  updatelink(change: SankeyPinEvent) {
    let link = this.links.find(item => item.name == change.link);
    if (!link) {
      link = { name: change.link, size: change.size }
      this.links.push(link);
    }
    else if (!change.isinput) {
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
    const padding = 0.02;
    const maxheight = 0.4;  // height of largest node
    const spacing = 0.5

    let largestvalue = 0;

    // creation nodes without layout information
    loadenergy.nodes.forEach((item, index) => {
      const node: SankeyNodeData = {
        name: item.name,
        position: [0, 0, 0],
        width: 0.1,
        height: 0,
        inputs: [],
        outputs: [],
        material: new MeshBasicMaterial({ color: '#' + new Color(Math.random() * 0xffffff).getHexString() }),
      }
      const outputs = loadenergy.links.filter(item => item.source == index);
      let total = 0;
      outputs.forEach(output => {
        node.outputs.push({ source: output.source, target: output.target, link: `${output.source}-${output.target}`, value: output.value })
        total += output.value;
      });

      // temporary store in height
      node.height = total;

      const inputs = loadenergy.links.filter(item => item.target == index);
      total = 0;
      inputs.forEach(input => {
        node.inputs.push({ source: input.source, target: input.target, link: `${input.source}-${input.target}`, value: input.value })
        total += input.value;
      });

      // use the greater of the two heights
      if (total > node.height) node.height = total;

      // track the largest node.  Other nodes will eventually be scaled relative to this
      if (node.height > largestvalue) largestvalue = node.height;

      this.nodes.push(node);
    });


    //
    // now calculate layout information
    //

    // calculate node heights.  Ensure minimum is big enough to see
    this.nodes.forEach(column => {
      column.height = Math.max(0.04, column.height / largestvalue * maxheight);
    })

    // track nodes already included and not included in layout
    const included = new Map<string, SankeyNodeData>([]);
    const notincluded = new Map<string, SankeyNodeData>([]);

    // anything without an input, must be left most
    let nodes = this.nodes.filter(node => node.inputs.length == 0);

    let accumheight = 0;
    nodes.forEach((column, index) => {
      included.set(column.name, column);

      column.position = [0, accumheight + column.height / 2 + padding, 0.001 * (index + 1)]
      accumheight += column.height + padding;
    });
    this.columns.push(nodes);

    nodes = this.nodes.filter(node => node.inputs.length != 0);
    nodes.forEach(column => notincluded.set(column.name, column));

    // anything without an output, must be right most
    const lastnodes = this.nodes.filter(node => node.outputs.length == 0);

    let columnindex = 1;
    while (notincluded.size > 0) {
      const columns: Array<SankeyNodeData> = [];
      accumheight = 0;

      // now find nodes where all inputs are included in nodes to left
      Array.from(notincluded.values()).forEach(node => {
        let count = 0;
        node.inputs.forEach(input => {
          const name = this.nodes[input.source].name
          if (included.has(name)) count++;
        })

        // if all inputs are included
        if (count == node.inputs.length) {
          columns.push(node);

          node.position = [columnindex * spacing, accumheight + node.height / 2 + padding, 0.001 * columns.length]
          accumheight += node.height + padding;
        }
      })

      columns.forEach(node => {
        included.set(node.name, node);
        notincluded.delete(node.name);
      });

      // remove node if it has no outputs.  It will be moved later to last columns
      lastnodes.forEach(last => {
        const index = columns.findIndex(node => node == last);
        if (index != -1)
          columns.splice(index, 1);
      })

      if (columns.length)
        this.columns.push(columns);

      columnindex++;
    }

    // backup to last column
    columnindex--;

    // redistribute nodes in right most column
    accumheight = 0;
    lastnodes.forEach((column, index) => {
      column.position = [columnindex * spacing, accumheight + column.height / 2 + padding, 0.001 * (index + 1)]
      accumheight += column.height + padding;
    });
    this.columns.push(lastnodes);
  }
}
