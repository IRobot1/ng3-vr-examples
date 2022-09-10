import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Group, MathUtils, Mesh, Object3D, Vector3 } from "three";
import { make, NgtTriple } from "@angular-three/core";

import { Graph, Link, Node } from "ngraph.graph";
import createLayout, { Layout } from "ngraph.forcelayout";

export interface NodeData {
  color: string;
  text: string;
  size: number;
  textcolor: string;
  textsize: number;
}

export class NodeDataDefault implements NodeData {
  constructor(
    public node: Node<any>,
    public color: string = 'blue',
    public size: number = 1,
    public textcolor = 'white',
    public textsize = 0.8
  ) { }

  get text(): string {
    return this.node.id.toString();
  }
}

export interface LinkData {
  color: string;
  text: string;
  textcolor: string;
  textsize: number;
  arrowcolor: string;
}

export class LinkDataDefault implements LinkData {
  constructor(
    public link: Link<any>,
    public color: string = 'white',
    public textcolor = 'white',
    public textsize = 0.5,
    public arrowcolor = 'white'
  ) { }

  get text(): string {
    return this.link.fromId.toString() + ' / ' + this.link.toId.toString();
  }
}


class InternalNode3D {
  mesh!: Mesh;
  constructor(public node: Node<NodeData>) { }
}

class InternalLink3D {
  group!: Group;
  mesh!: Mesh;
  arrow?: Mesh;
  label?: Object3D;
  constructor(public link: Link<LinkData>, public length = 1) { }
}


@Component({
  selector: 'force-layout-diagram',
  templateUrl: './force-layout-diagram.component.html',
})
export class ForceLayoutComponent implements OnInit {
  @Input() graph!: Graph<NodeData, LinkData>;

  @Input() origin = [0, 0, 0] as NgtTriple;
  @Input() dimensions = 2 | 3;

  @Input() labelFont = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff';
  @Input() castShadow = false;

  @Input() showArrow = true;
  @Input() showNodeLabel = true;
  @Input() showLinkLabel = false;

  @Input() linkLength = 1;
  @Input() animate = true;

  @Input() list: Array<Object3D> = [];

  @Output() stable = new EventEmitter<boolean>();


  protected nodes: Array<InternalNode3D> = [];
  protected links: Array<InternalLink3D> = [];

  ngOnInit(): void {
    if (!this.graph) {
      console.warn('network diagram graph Input must be set');
      return;
    }

    const nodes: Array<InternalNode3D> = [];
    const links: Array<InternalLink3D> = [];
    let first!: Node<NodeData>;
    this.graph.forEachNode(item => {
      if (this.nodes.length == 0) first = item;
      nodes.push(new InternalNode3D(item));
    });
    this.graph.forEachLink(item => {
      links.push(new InternalLink3D(item));
    });

    // graduall add nodes and links to be VR friendly
    this.addNodes(nodes);
    this.addLinks(links);
    this.finisInit(first);
  }

  private addNodes(nodes: Array<InternalNode3D>) {
    let index = 0;
    const timer = setInterval(() => {
      this.nodes.push(nodes[index++]);
      if (index >= nodes.length) {
        clearInterval(timer);
      }
    }, 0);
  }

  private addLinks(links: Array<InternalLink3D>) {
    let index = 0;
    const timer = setInterval(() => {
      this.links.push(links[index++]);
      if (index >= links.length) {
        clearInterval(timer);
      }
    }, 0);
  }

  private finisInit(first: Node<NodeData>) {
    const physicsSettings = {
      timeStep: 0.5,
      dimensions: this.dimensions,
      gravity: -10,
      theta: 0.8,
      springLength: this.linkLength,
      springCoefficient: 0.8,
      dragCoefficient: 0.9,
    };

    const layout = createLayout(this.graph, physicsSettings);
    layout.pinNode(first as Node<any>, true);

    const origin = make(Vector3, this.origin);

    this.stable.next(false);
    const timer = setInterval(() => {
      if (this.animate) this.showgraph(layout, origin);
      if (layout.step()) {
        if (!this.animate) this.showgraph(layout, origin);
        this.stable.next(true);
        clearInterval(timer);
      }
    }, 10)
  }

  private showgraph(layout: Layout<any>, origin: Vector3) {

    this.nodes.forEach(item => {
      const vector = layout.getNodePosition(item.node.id);
      let z = 0;
      if (vector.z) z = vector.z;

      const mesh = item.mesh as Object3D;
      if (mesh) {
        mesh.position.set(vector.x, vector.y, z);
        mesh.visible = true;
      }
    });

    this.links.forEach(item => {
      const link = layout.getLinkPosition(item.link.id);

      const group = item.group;
      if (group) {
        const from = new Vector3(link.from.x, link.from.y, link.from.z);
        const to = new Vector3(link.to.x, link.to.y, link.to.z);
        item.length = from.sub(to).length();

        group.position.copy(to);
        group.lookAt(from.add(origin));
        group.rotateX(MathUtils.degToRad(90));

        const mesh = item.mesh;
        mesh.position.set(0, item.length / 2, 0);
        mesh.scale.y = item.length;
        mesh.visible = true;

        if (item.label) {
          item.label.position.set(0, item.length / 2, 0);
          item.label.visible = true;
        }

        const arrow = item.arrow;
        if (arrow) {
          const node = this.graph.getNode(item.link.toId);
          let size = 1;
          if (node) size = node.data.size;

          arrow.position.set(0, size + 0.2, 0);
          arrow.visible = true;
        }

      }
    });
  }
}
