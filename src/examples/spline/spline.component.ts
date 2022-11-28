import { AfterViewInit, Component, OnInit } from "@angular/core";

import { CubicBezierCurve, Mesh, Object3D, Shape, ShapeGeometry, SplineCurve, Vector2, Vector3 } from "three";

interface Debug {
  position: Vector3;
  color: string;
}

@Component({
  templateUrl: './spline.component.html',
})
export class SplineExample implements AfterViewInit {
  startposition = new Vector3(-0.1, 0.5, -0.001)
  endposition = new Vector3(0.1, 1, -0.001)

  width = 0.02

  shapemesh!: Mesh;

  points: Array<Debug> = [];

  addpoint(world: Vector3, color: string) {
    this.points.push({ position: new Vector3(world.x, world.y, 0.001), color });
  }

  updatecurve(): void {
    this.points.length = 0;
    const start = new Vector2(this.startposition.x, this.startposition.y);
    const end = new Vector2(this.endposition.x, this.endposition.y);

    const startplus = start.clone()
    const endplus = end.clone()

    const dx = start.x - end.x;
    const dy = start.y - end.y;
    const diff = Math.sqrt((dx * dx) + (dy * dy)) * .3;


    startplus.x += diff;
    endplus.x -= diff;

    const curve = new CubicBezierCurve(start, startplus, endplus, end);

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

    const topworld = new Vector3();
    const botworld = new Vector3();

    topobject.getWorldPosition(topworld)
    shape.moveTo(topworld.x, topworld.y)
    this.addpoint(topworld, 'red');

    bottomobject.getWorldPosition(botworld)
    this.addpoint(botworld, 'blue');

    point = points[1]
    mesh.lookAt(point.x, point.y, 0)

    const bottompoints: Array<Vector2> = [new Vector2(botworld.x, botworld.y)];

    const add = (topworld: Vector3, botworld: Vector3) => {
      shape.lineTo(topworld.x, topworld.y)
      bottompoints.push(new Vector2(botworld.x, botworld.y))
      this.addpoint(topworld, 'red');
      this.addpoint(botworld, 'blue');

    }
    points.forEach((point, index) => {
      if (index < 1) return;
      mesh.position.set(point.x, point.y, 0);

      topobject.getWorldPosition(topworld)
      bottomobject.getWorldPosition(botworld)

      // start is left of end and above
      if (this.startposition.x <= this.endposition.x) {
        add(topworld, botworld);
      }
      else {
        // start is right of end
        if (this.startposition.y >= this.endposition.y) {
          if (topworld.x >= botworld.x) {
            add(topworld, botworld);
          }
          else { // flip top and bottom
            add(botworld, topworld);
          }
        }
        else {
          if (topworld.x <= botworld.x) {
            add(topworld, botworld);
          }
          else { // flip top and bottom
            add(botworld, topworld);
          }
        }
      }


      if (index + 2 == points.length)
        mesh.rotation.set(0, 0, 0)
      else if (index + 1 < points.length) {
        const next = points[index + 1]
        mesh.lookAt(next.x, next.y, 0)
      }
    });

    bottompoints.reverse().forEach((point, index) => {
      shape.lineTo(point.x, point.y)
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

    //setInterval(() => {
    //  leftcenter.rotation.z += 0.1;
    //  left.getWorldPosition(this.startposition);
    //  rightcenter.rotation.z += 0.1;
    //  right.getWorldPosition(this.endposition);
    //}, 100)
      this.updatecurve()
  }

}
