import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Box3, BufferGeometry, CatmullRomCurve3, Group, LineBasicMaterial, MathUtils, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { NgtTriple } from "@angular-three/core";

import { Node, graphlib, GraphEdge, layout, Label } from 'dagre';

export interface NodeData extends Label {
  color: string;
  text: string;
  size: number;
  textcolor: string;
  textsize: number;
  mesh?: Mesh; // set during layout.  Allows overriding mesh geometry
}

export class NodeDataDefault implements NodeData {
  constructor(
    public label: string,
    public color: string = 'blue',
    public size: number = 0.04,
    public textcolor = 'white',
    public textsize = 0.05
  ) { }

  get text(): string {
    return this.label;
  }
}

export interface LinkData {
  color: string;
  text: string;
  textcolor: string;
  textsize: number;
  arrowcolor: string;
}

export class LinkDataDefault implements GraphEdge, LinkData {
  constructor(
    public label: string,
    public color: string = 'white',
    public textcolor = 'white',
    public textsize = 0.05,
    public arrowcolor = 'white'
  ) { }

  [key: string]: any;
  points!: { x: number; y: number; }[];

  get text(): string {
    return this.label;
  }
}


class InternalNode3D {
  object!: Object3D;
  constructor(public node: Node<NodeData>) { }
}

class InternalLink3D {
  object!: Object3D;
  arrow?: Mesh;
  label?: Object3D;
  geometry!: BufferGeometry;
  material!: LineBasicMaterial;
  length = 0; // use internally

  constructor(public link: GraphEdge) { }
}

export interface NodeSelected {
  node: Node<NodeData>;
  position: Vector3;
}

export interface LinkSelected {
  link: GraphEdge;
  position: Vector3;
}

@Component({
  selector: 'directed-graph',
  templateUrl: './directed-graph.component.html',
})
export class DirectedGraphComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() graph!: graphlib.Graph<NodeData>;

  @Input() labelFont = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff';
  @Input() castShadow = false;

  @Input() showArrow = true;
  @Input() showNodeLabel = true;
  @Input() showLinkLabel = false;

  @Input() selectable: Array<Object3D> = [];

  @Output() loaded = new EventEmitter<boolean>();

  @Output() nodeSelected = new EventEmitter<NodeSelected>();
  @Output() linkSelected = new EventEmitter<LinkSelected>();


  protected nodes: Array<InternalNode3D> = [];
  protected links: Array<InternalLink3D> = [];

  visible = false;
  group!: Group;

  ngOnInit(): void {
    if (!this.graph) {
      console.warn('network diagram graph Input must be set');
      return;
    }

    const nodes: Array<InternalNode3D> = [];
    const links: Array<InternalLink3D> = [];

    layout(this.graph);

    this.graph.nodes().forEach(item => {
      const node = this.graph.node(item);
      nodes.push(new InternalNode3D(node));
    });
    this.graph.edges().forEach(item => {
      const edge = this.graph.edge(item);
      links.push(new InternalLink3D(edge));
    });

    // graduall add nodes and links to be VR friendly
    this.displayNodes(nodes);
    this.displayLinks(links);

    const timer = setInterval(() => {
      // wait for nodes and links to get added
      if (this.nodes.length == nodes.length && this.links.length == links.length) {
        this.showgraph();

        const box = new Box3();
        box.setFromObject(this.group);
        const center = new Vector3();
        box.getCenter(center);

        const position = this.group.position.clone();
        this.group.position.sub(center).add(position);
        this.visible = true;

        this.loaded.next(true);
        clearInterval(timer);
      }
    }, 250);
  }

  private displayNodes(nodes: Array<InternalNode3D>) {
    let index = 0;
    const timer = setInterval(() => {
      if (index < nodes.length) {
        this.nodes.push(nodes[index++]);
      }
      else {
        clearInterval(timer);
      }
    }, 0);
  }

  private displayLinks(links: Array<InternalLink3D>) {
    let index = 0;
    const timer = setInterval(() => {
      if (index < links.length) {
        this.links.push(links[index++]);
      }
      else {
        clearInterval(timer);
      }
    }, 0);
  }

  showgraph() {

    this.nodes.forEach(item => {
      const mesh = item.object as Object3D;
      if (mesh) {
        mesh.position.set(item.node.x / 100, -item.node.y / 100, 0);
        mesh.visible = true
      }
    });

    this.links.forEach(item => {

      const points: Array<Vector3> = [];

      item.link.points.forEach(point => {
        points.push(new Vector3(point.x / 100, -point.y / 100));
      });

      const curve = new CatmullRomCurve3(points);
      const curvepoints = curve.getPoints(25);
      console.warn(curvepoints)
      item.geometry = new BufferGeometry().setFromPoints(curvepoints);
      item.material = new LineBasicMaterial({ color: item.link['data'].color })

      if (item.label) {
        const middle = curvepoints[12];
        const center = new Vector3(middle.x, middle.y, 0);
        item.label.position.copy(center);
      }

      const arrow = item.arrow;
      if (arrow) {
        const first = curvepoints[curvepoints.length - 3];
        const last = curvepoints[curvepoints.length - 1];

        const from = new Vector3(first.x, first.y, 0);

        const node = this.graph.node(item.link['from']);
        let size = 1;
        if (node) size = node.size;

        const to = new Vector3(last.x, last.y, 0);

        const tempMatrix = new Matrix4();
        tempMatrix.setPosition(from)
        tempMatrix.lookAt(from, to, new Vector3(0, 0, 1));

        arrow.matrixWorld.copy(tempMatrix);
        arrow.position.copy(to);
        arrow.rotation.setFromRotationMatrix(tempMatrix);

        // rotate cone to point along line
        arrow.rotateX(MathUtils.degToRad(90));

        // adjust so its ouside node mesh
        arrow.translateOnAxis(new Vector3(0, 1, 0), size * 2)

      }

    });
  }

  nodeClicked(item: InternalNode3D) {
    const position = item.object.position.clone();
    this.nodeSelected.next({ node: item.node, position: position })
  }

  linkClicked(item: InternalLink3D) {
    const position = item.object.position.clone();
    this.linkSelected.next({ link: item.link, position: position })
  }
}
