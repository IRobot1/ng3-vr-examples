import { make, NgtStore, NgtTriple } from "@angular-three/core";

import { Camera, Group, MathUtils, Mesh, Object3D, Vector3 } from "three";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import createGraph, { Graph, Link, Node } from "ngraph.graph";
import createLayout, { Layout } from "ngraph.forcelayout";

import { networkdata } from "./network-data";


class LinkData {
  group!: Group;
  mesh!: Mesh;
  constructor(public length = 1) { }
}

@Component({
  templateUrl: './network.component.html',
})
export class NetworkExample implements OnInit {
  start = [-1, 1, -1] as NgtTriple;
  end = [1, 1, -1] as NgtTriple;
  length = 2;

  positions = new Float32Array([
    -1, 1, -1,
    1, 1, -1

  ]);

  nodes: Array<Node> = [];
  links: Array<Link<LinkData>> = [];

  scale = [0.01, 0.01, 0.01] as NgtTriple;
  position = [0, 0, 0] as NgtTriple;
  visible = false;

  y = 1;

  camera!: Camera;

  layout!: Layout<any>;

  constructor(
    private store: NgtStore,
  ) { }


  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);

    this.length = make(Vector3, this.end).sub(make(Vector3, this.start)).length();

    const g = createGraph();
    networkdata.forEach(item => {
      const from = item[0];
      const to = item[1];
      if (!g.hasNode(from)) {
        const node = g.addNode(from);
        node.id
        this.nodes.push(node);
      }
      if (!g.hasNode(to)) {
        const node = g.addNode(to);
        this.nodes.push(node);
      }
      const link = g.addLink(from, to);
      link.data = new LinkData();
      this.links.push(link);
    });

    const physicsSettings = {
      timeStep: 0.5,
      dimensions: 3,
      gravity: -10,
      theta: 0.8,
      springLength: 1,
      springCoefficient: 0.8,
      dragCoefficient: 0.9,
    };

    this.layout = createLayout(g, physicsSettings);
    this.layout.pinNode(this.nodes[0], true);

    const timer = setInterval(() => {
      if (this.layout.step()) {
        this.showgraph(g);
        this.position = [0, 1.5, -1];
        this.visible = true;
        clearInterval(timer);
      }
    }, 10)
  }

  showgraph(graph: Graph<Object3D, LinkData>) {
    if (this.layout) {

      graph.forEachNode(item => {
        const vector = this.layout.getNodePosition(item.id);
        let z = 0;
        if (vector.z) z = vector.z;
        (item.data as Object3D).position.set(vector.x, vector.y, z)
      });

      graph.forEachLink(item => {
        const link = this.layout.getLinkPosition(item.id);

        const group = item.data.group;
        if (group) {
          const from = new Vector3(link.from.x, link.from.y, link.from.z);
          const to = new Vector3(link.to.x, link.to.y, link.to.z);
          item.data.length = from.sub(to).length();

          group.position.copy(to);
          group.lookAt(from);
          group.rotateX(MathUtils.degToRad(90))

          item.data.mesh.position.set(0, item.data.length / 2, 0);
        }
      });
    }
  }

  tick(group: Object3D) {
    if (this.visible)
      group.rotation.y += 0.001;
  }
}
