import { Component, OnInit } from "@angular/core";

import { Camera, Color, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D } from "three";
import { NgtStore, NgtTriple } from "@angular-three/core";

import createGraph, { Graph } from "ngraph.graph";

import { CameraService } from "../../app/camera.service";

import { treedata } from "./tree-data";
import { LinkData, LinkDataDefault, NodeData, NodeDataDefault } from "./force-layout-diagram/force-layout-diagram.component";



class MyNodeData implements NodeData {
  public size: number = 1
  public textcolor = 'white'
  public textsize = 0.8
  public text: string = ''

  constructor(
    public color: string,
    public index: number,
  ) {
    const interval = MathUtils.randInt(1000, 10000);
    setInterval(() => {
      index++;
      this.text = `Node (${index})`;
    }, interval)
  }
}

class MyLinkData implements LinkData {
  public textcolor = 'white'
  public textsize = 0.6
  public arrowcolor = 'white'

  constructor(
    public color: string,
    public text: string,
  ) {
  }
}

@Component({
  templateUrl: './force-layout.component.html',
})
export class ForceLayoutExample implements OnInit {
  protected scale = [0.02, 0.02, 0.02] as NgtTriple;
  protected rotation = [0, 0, 0] as NgtTriple;

  protected list: Array<Object3D> = [];

  private camera!: Camera;

  graph!: Graph<NodeData, LinkData>;
  customgraph!: Graph<NodeData, LinkData>;

  stable = false;
  loading = true;

  constructor(
    private store: NgtStore,
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 2];
    this.cameraService.lookAt = [0, 1.5, 0];
  }


  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);

    let g = createGraph();

    treedata.forEach(item => {
      const from = item[0];
      const to = item[1];
      if (!g.hasNode(from)) {
        const node = g.addNode(from);
        node.data = new NodeDataDefault(node)
      }
      if (!g.hasNode(to)) {
        const node = g.addNode(to);
        node.data = new NodeDataDefault(node)
      }
      const link = g.addLink(from, to);
      link.data = new LinkDataDefault(link);
    });
    this.graph = g;


    g = createGraph();

    treedata.forEach((item, index) => {
      const from = item[0];
      const to = item[1];
      if (!g.hasNode(from)) {
        g.addNode(from, new MyNodeData(this.randomcolor, index));
      }
      if (!g.hasNode(to)) {
        g.addNode(to, new MyNodeData(this.randomcolor, index));
      }
      g.addLink(from, to, new MyLinkData('white', 'Link ' + index));

    });
    this.customgraph = g;
  }

  get randomcolor(): string {
    return '#' + new Color(Math.random() * 0xffffff).getHexString();
  }

  flipAfterLoad(loading: boolean, group: Group) {
    this.loading = !loading;
    if (!this.loading) {
      group.rotation.y = MathUtils.degToRad(180);
    }
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

  tick(group: Object3D) {
    if (this.stable)
      group.rotation.y += 0.001;
  }
}
