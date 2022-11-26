import { make, NgtTriple } from "@angular-three/core";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, SplineCurve, Vector2, Vector3 } from "three";

@Component({
  templateUrl: './spline.component.html',
})
export class SplineExample implements AfterViewInit {
  startposition = new Vector2(0, 2)
  endposition = new Vector2(1, 1)

  shapepoints: Array<Vector2> = [];
  points!: Array<Vector2>;

  group!: Group;
  circle!: CircleGeometry;
  geometry!: BufferGeometry;

  mesh!: Mesh;
  top!: Mesh;
  bottom!: Mesh;

  shapemesh!: Mesh;

  meshready(mesh: Mesh) {
    this.mesh = mesh;

    const start = this.startposition;
    const end = this.endposition;

    const startplus = start.clone()
    const endplus = end.clone()
    const diff = Math.abs(start.x - end.x) / 3;

    startplus.x += diff;
    endplus.x -= diff;

    const curve = new SplineCurve([start, startplus, endplus, end]);

    this.points = curve.getPoints(25);

    this.circle = new CircleGeometry(0.01)
    this.top = new Mesh(this.circle, new MeshBasicMaterial({ color: 'blue' }));
    this.top.position.set(0, 0.05, 0.001);

    this.bottom = new Mesh(this.circle, new MeshBasicMaterial({ color: 'red' }));
    this.bottom.position.set(0, -0.05, 0.001);
    mesh.add(this.top).add(this.bottom);

  }

  addpoint(x: number, y: number) {
    const mesh = new Mesh(this.circle, new MeshBasicMaterial({ color: 'black' }));
    mesh.position.set(x, y, 0.001);
    this.group.add(mesh);
  }

  ngAfterViewInit(): void {
    const shape = new Shape();
    const top = this.top.position;

    let point = this.points[0]

    this.mesh.position.set(point.x, point.y, 0);

    const world = new Vector3();
    this.top.getWorldPosition(world)
    shape.moveTo(world.x, world.y)
    this.addpoint(world.x, world.y)

    point = this.points[1]
    this.mesh.lookAt(point.x, point.y, 0)

    this.points.forEach((point, index) => {
      if (index < 1) return;
      this.mesh.position.set(point.x, point.y, 0);
      this.top.getWorldPosition(world)
      shape.lineTo(world.x, world.y)
      this.addpoint(world.x, world.y)

      if (index + 2 == this.points.length) 
        this.mesh.rotation.set(0, 0, 0)
      else if (index + 1 < this.points.length) {
        const next = this.points[index + 1]
        this.mesh.lookAt(next.x, next.y, 0)
      }
      

    })

    this.points.reverse().forEach((point, index) => {
      this.mesh.position.set(point.x, point.y, 0);

      this.bottom.getWorldPosition(world)
      shape.lineTo(world.x, world.y)
      this.addpoint(world.x, world.y)

      if (index + 2 == this.points.length)
        this.mesh.rotation.set(0, 0, 0);
      else if (index + 1 < this.points.length) {
        const next = this.points[index + 1]
        this.mesh.lookAt(next.x, next.y, 0)
      }
    })

    shape.closePath();

    console.warn(shape)
    this.shapemesh.geometry = new ShapeGeometry(shape);

  }
}
