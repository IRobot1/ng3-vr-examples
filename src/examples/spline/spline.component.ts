import { AfterViewInit, Component, OnInit } from "@angular/core";

import { Mesh, Object3D, Shape, ShapeGeometry, SplineCurve, Vector2, Vector3 } from "three";

@Component({
  templateUrl: './spline.component.html',
})
export class SplineExample implements AfterViewInit {
  startposition = new Vector3(-1, 1, 0)
  endposition = new Vector3(1, 1, 0)

  width = 0.02

  shapemesh!: Mesh;


  updatecurve(): void {

    const start = new Vector2(this.startposition.x, this.startposition.y);
    const end = new Vector2(this.endposition.x, this.endposition.y);

    const startplus = start.clone()
    const endplus = end.clone()

    const diff = Math.abs(start.x - end.x) / 3;

    startplus.x += diff;
    endplus.x -= diff;

    const curve = new SplineCurve([start, startplus, endplus, end]);

    const points = curve.getPoints(25);

    const mesh = new Object3D();
    const topobject = new Object3D();
    topobject.position.set(0, this.width / 2, 0.001);

    const bottomobject = new Object3D();
    bottomobject.position.set(0, -this.width / 2, 0.001);
    mesh.add(topobject).add(bottomobject);

    const shape = new Shape();

    let point = points[0]

    mesh.position.set(point.x, point.y, 0);

    const world = new Vector3();
    topobject.getWorldPosition(world)
    shape.moveTo(world.x, world.y)

    point = points[1]
    mesh.lookAt(point.x, point.y, 0)

    points.forEach((point, index) => {
      if (index < 1) return;
      mesh.position.set(point.x, point.y, 0);
      topobject.getWorldPosition(world)
      shape.lineTo(world.x, world.y)

      if (index + 2 == points.length)
        mesh.rotation.set(0, 0, 0)
      else if (index + 1 < points.length) {
        const next = points[index + 1]
        mesh.lookAt(next.x, next.y, 0)
      }
    });

    points.reverse().forEach((point, index) => {
      mesh.position.set(point.x, point.y, 0);

      bottomobject.getWorldPosition(world)
      shape.lineTo(world.x, world.y)

      if (index + 2 == points.length)
        mesh.rotation.set(0, 0, 0);
      else if (index + 1 < points.length) {
        const next = points[index + 1]
        mesh.lookAt(next.x, next.y, 0)
      }
    });

    shape.closePath();

    if (this.shapemesh.geometry) this.shapemesh.geometry.dispose();
    this.shapemesh.geometry = new ShapeGeometry(shape);

  }

  ngAfterViewInit(): void {

    const leftcenter = new Object3D();
    leftcenter.position.set(-0.6, 1, 0);
    const left = new Object3D();
    left.position.set(0.5, 0, 0);
    leftcenter.add(left);

    const rightcenter = new Object3D();
    rightcenter.position.set(0.6, 1, 0);
    const right = new Object3D();
    right.position.set(-0.5, 0, 0);
    rightcenter.add(right);

    setInterval(() => {
      leftcenter.rotation.z += 0.1;
      left.getWorldPosition(this.startposition);
      rightcenter.rotation.z += 0.1;
      right.getWorldPosition(this.endposition);
      this.updatecurve();
    }, 100)
  }

}
