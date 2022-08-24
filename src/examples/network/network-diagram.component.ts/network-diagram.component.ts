import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Group, MathUtils, Mesh, Object3D, Vector3 } from "three";
import { make, NgtTriple } from "@angular-three/core";

import { Graph, Link, Node } from "ngraph.graph";
import createLayout, { Layout } from "ngraph.forcelayout";

class NodeData {
  mesh!: Mesh;
  constructor(public data: any = undefined) { }
}

class LinkData {
  group!: Group;
  mesh!: Mesh;
  arrow?: Mesh;
  label?: Object3D;
  constructor(public data: any = undefined, public length = 1) { }
}


@Component({
  selector: 'network-diagram',
  templateUrl: './network-diagram.component.html',
})
export class NetworkDiagramComponent implements OnInit {
  @Input() graph!: Graph<NodeData, LinkData>;

  @Input() origin = [0, 0, 0] as NgtTriple;

  @Input() nodeSize = 1;
  @Input() nodeLabelSize = 0.8;
  @Input() linkLabelSize = 0.5;

  @Input() labelFont = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff';
  @Input() castShadow = false;

  @Input() showArrow = true;
  @Input() showNodeLabel = true;
  @Input() showLinkLabel = false;

  @Input() nodeColor = 'blue';
  @Input() linkColor = 'white';
  @Input() arrowColor = 'white';
  @Input() nodeTextColor = 'white';
  @Input() linkTextColor = 'white';

  @Input() linkLength = 1;
  @Input() animate = true;

  @Input() list: Array<Object3D> = [];

  @Output() stable = new EventEmitter<boolean>();


  protected nodes: Array<Node<NodeData>> = [];
  protected links: Array<Link<LinkData>> = [];

  ngOnInit(): void {
    if (!this.graph) {
      console.warn('network diagram graph Input must be set');
      return;
    }

    const nodes: Array<Node<NodeData>> = [];
    const links: Array<Link<LinkData>> = [];
    let first!: Node<any>;
    this.graph.forEachNode(item => {
      item.data = new NodeData();
      if (this.nodes.length == 0) first = item;
      nodes.push(item);
    });
    this.graph.forEachLink(item => {
      item.data = new LinkData();
      links.push(item);
    });

    // graduall add nodes and links to be VR friendly
    this.addNodes(nodes);
    this.addLinks(links);
    this.finisInit(first);
  }

  private addNodes(nodes: Array<Node<NodeData>>) {
    let index = 0;
    const timer = setInterval(() => {
      this.nodes.push(nodes[index++]);
      if (index >= nodes.length) {
        clearInterval(timer);
      }
    }, 0);
  }

  private addLinks(links: Array<Link<LinkData>>) {
    let index = 0;
    const timer = setInterval(() => {
      this.links.push(links[index++]);
      if (index >= links.length) {
        clearInterval(timer);
      }
    }, 0);
  }

  private finisInit(first: Node<any>) {
    const physicsSettings = {
      timeStep: 0.5,
      dimensions: 3,
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
      if (this.animate) this.showgraph(this.graph, layout, origin);
      if (layout.step()) {
        if (!this.animate) this.showgraph(this.graph, layout, origin);
        this.stable.next(true);
        clearInterval(timer);
      }
    }, 10)
  }

  private showgraph(graph: Graph<NodeData, LinkData>, layout: Layout<any>, origin: Vector3) {

    graph.forEachNode(item => {
      const vector = layout.getNodePosition(item.id);
      let z = 0;
      if (vector.z) z = vector.z;

      const mesh = item.data.mesh as Object3D;
      if (mesh) {
        mesh.position.set(vector.x, vector.y, z);
        mesh.visible = true;
      }
    });

    graph.forEachLink(item => {
      const link = layout.getLinkPosition(item.id);

      const group = item.data.group;
      if (group) {
        const from = new Vector3(link.from.x, link.from.y, link.from.z)
        const to = new Vector3(link.to.x, link.to.y, link.to.z)
        item.data.length = from.sub(to).length();

        group.position.copy(to);
        group.lookAt(from.add(origin));
        group.rotateX(MathUtils.degToRad(90))

        const mesh = item.data.mesh;
        mesh.position.set(0, item.data.length / 2, 0);
        mesh.scale.y = item.data.length;
        mesh.visible = true;

        item.data.label?.position.set(0, item.data.length / 2, 0);

        const arrow = item.data.arrow;
        if (arrow) {
          arrow.position.set(0, this.nodeSize + 0.2, 0);
          arrow.visible = true;
        }

      }
    });
  }
}
