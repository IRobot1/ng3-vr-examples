import { Component, Input, OnInit } from "@angular/core";

import { Camera, Group, Intersection, MathUtils, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { NgtStore, NgtTriple } from "@angular-three/core";

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
  @Input() position = [0, 1.5, -1] as NgtTriple;

  protected nodes: Array<Node> = [];
  protected links: Array<Link<LinkData>> = [];

  protected list: Array<Object3D> = [];

  private stable = false;
  private camera!: Camera;

  constructor(
    private store: NgtStore,
  ) { }


  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);

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

    const layout = createLayout(g, physicsSettings);
    layout.pinNode(this.nodes[0], true);

    const timer = setInterval(() => {
      this.showgraph(g, layout);
      if (layout.step()) {
        this.stable = true;
        clearInterval(timer);
      }
    }, 10)
  }

  highlight(object: Object3D) {
    object.scale.multiplyScalar(2);
    ((object as Mesh).material as MeshStandardMaterial).color.setStyle('red');
    object.lookAt(this.camera.position);
  }

  unhighlight(object: Object3D) {
    object.scale.multiplyScalar(0.5);
    //((object as Mesh).material as MeshStandardMaterial).emissive.b = 1;
    ((object as Mesh).material as MeshStandardMaterial).color.setStyle('blue');
  }

  showgraph(graph: Graph<Object3D, LinkData>, layout: Layout<any>) {

    graph.forEachNode(item => {
      const vector = layout.getNodePosition(item.id);
      let z = 0;
      if (vector.z) z = vector.z;
      (item.data as Object3D).position.set(vector.x, vector.y, z)
    });

    graph.forEachLink(item => {
      const link = layout.getLinkPosition(item.id);

      const group = item.data.group;
      if (group) {
        const from = new Vector3(link.from.x, link.from.y, link.from.z)
        const to = new Vector3(link.to.x, link.to.y, link.to.z)
        item.data.length = from.sub(to).length();

        group.position.copy(to);
        group.lookAt(from.add(new Vector3(0, 1.5, -1)));
        group.rotateX(MathUtils.degToRad(90))

        item.data.mesh.position.set(0, item.data.length / 2, 0);
        item.data.mesh.scale.y = item.data.length;
      }
    });

  }

  tick(group: Object3D) {
    if (this.stable)
      group.rotation.y += 0.001;
  }
}
