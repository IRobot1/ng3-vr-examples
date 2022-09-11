import { Component, OnInit } from "@angular/core";

import { Camera, Mesh, MeshStandardMaterial, Object3D } from "three";
import { NgtStore } from "@angular-three/core";

import { graphlib } from 'dagre';

import { CameraService } from "../../app/camera.service";
import { LinkDataDefault, LinkSelected, NodeData, NodeDataDefault, NodeSelected } from "./directed-graph.component.ts/directed-graph.component";

import { civdata } from "./civ-techtree-data";



@Component({
  templateUrl: './graph.component.html',
})
export class GraphExample implements OnInit {
  graph!: graphlib.Graph<NodeData>;
  loading = true;
  labelFont = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff';

  protected list: Array<Object3D> = [];

  private camera!: Camera;

  constructor(
    private store: NgtStore,
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 2];
    this.cameraService.lookAt = [0, 1.5, 0];
  }

  ngOnInit(): void {

    this.camera = this.store.get(s => s.camera);

    var g = new graphlib.Graph({ multigraph: true });

    g.setGraph({ rankdir: 'LR' });

    civdata.forEach(tech => {
      const from = tech.tech_name;

      tech.leads_to.forEach(item => {
        const to = item;
        if (!g.hasNode(from)) {
          g.setNode(from, new NodeDataDefault(from));
        }
        if (to) {
          if (!g.hasNode(to)) {
            g.setNode(to, new NodeDataDefault(to));
          }

          g.setEdge(from, to, { from: from, to: to });
          const data = g.edge(from, to);
          data['data'] = new LinkDataDefault('test');
          // export to mermaid
          //console.log(`${from.replace(' ', '')}[${from}] --> ${to.replace(' ', '')}[${to}]`);
        }
      });
    })
    this.graph = g as graphlib.Graph<NodeData>;

  }

  selected(object: Object3D) {
    console.warn(object);
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


  nodeSelected(event: NodeSelected) {
    console.warn(event)
  }

  linkSelected(event: LinkSelected) {
    console.warn(event)
  }
}
