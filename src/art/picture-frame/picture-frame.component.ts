import { Component, Input, OnInit } from "@angular/core";

import { Euler, Group, Material, MathUtils, Mesh, Path, Shape, ShapeGeometry, Vector2, Vector3 } from "three";
import { make, NgtEuler, NgtStore, NgtVector3 } from "@angular-three/core";


@Component({
  selector: 'picture-frame',
  templateUrl: './picture-frame.component.html',
})
export class PictureFrameShapeComponent implements OnInit {
  @Input() name = '';
  @Input() visible = true;
  @Input() position = [0, 0, 0] as NgtVector3;
  @Input() rotation = [0, 0, 0] as NgtEuler;
  @Input() scale = [1, 1, 1] as NgtVector3;

  @Input() width = 4 / 3;
  @Input() height = 1;
  @Input() framesize = 0.01;
  @Input() framespace = 0.01;

  @Input() cornerstretch = 1;
  @Input() wedgestretch = 1;

  @Input() framematerial!: Material;
  @Input() chromematerial!: Material;

  @Input() buildgeometry = (shape: Shape) => { return new ShapeGeometry(shape) }

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    this.update();
  }

  private update() {
    const scene = this.store.get(s => s.scene);
    const group = new Group();
    group.name = this.name;
    group.visible = this.visible;
    group.position.copy(make(Vector3, this.position));
    group.position.copy(make(Vector3, this.position));
    group.scale.copy(make(Vector3, this.scale));

    let halfwidth = this.width / 2;
    let halfheight = this.height / 2;

    // draw outside of frame
    const shape = new Shape()
      .moveTo(-halfwidth, halfheight) // top left
      .lineTo(halfwidth, halfheight) // top right
      .lineTo(halfwidth, -halfheight) // bottom right
      .lineTo(-halfwidth, -halfheight) // bottom left
    // autoclose

    halfwidth -= this.framesize;
    halfheight -= this.framesize;

    // draw hole in frame
    let holePath = new Path()
      .moveTo(halfwidth, halfheight) // top left
      .lineTo(-halfwidth, halfheight) // top right
      .lineTo(-halfwidth, -halfheight) // bottom right
      .lineTo(halfwidth, -halfheight) // bottom left
    // autoclose

    shape.holes.push(holePath);

    group.add(new Mesh(this.buildgeometry(shape), this.framematerial));

    const fs = this.framesize;
    const st = this.cornerstretch;

    const points: Array<Vector2> = []
    points.push(new Vector2(-fs * (st + 1), fs))
    points.push(new Vector2(-fs * (st + 2), fs * 2))
    points.push(new Vector2(fs * 2, fs * 2))
    points.push(new Vector2(fs * 2, -fs * (st + 2)))
    points.push(new Vector2(fs, -fs * (st + 1)))
    points.push(new Vector2(fs, fs))

    const corner = this.buildgeometry(new Shape(points));
    halfwidth += this.framespace;
    halfheight += this.framespace;

    const topright = new Mesh(corner, this.chromematerial);
    topright.position.set(halfwidth, halfheight, 0);
    group.add(topright);

    const topleft = new Mesh(corner, this.chromematerial);
    topleft.position.set(-halfwidth, halfheight, 0);
    topleft.rotation.z = MathUtils.degToRad(90)
    group.add(topleft);

    const bottomright = new Mesh(corner, this.chromematerial);
    bottomright.position.set(halfwidth, -halfheight, 0);
    bottomright.rotation.z = MathUtils.degToRad(-90)
    group.add(bottomright);

    const bottomleft = new Mesh(corner, this.chromematerial);
    bottomleft.position.set(-halfwidth, -halfheight, 0);
    bottomleft.rotation.z = MathUtils.degToRad(180)
    group.add(bottomleft);

    const ws = this.wedgestretch;
    points.length = 0;
    points.push(new Vector2(0, 0))
    points.push(new Vector2(-fs * (ws + 6), 0))
    points.push(new Vector2(-fs * (ws + 4), fs * 2))
    points.push(new Vector2(fs * (ws + 4), fs * 2))
    points.push(new Vector2(fs * (ws + 6), 0))
    points.push(new Vector2(0, 0))

    const wedge = this.buildgeometry(new Shape(points));

    const top = new Mesh(wedge, this.chromematerial);
    top.position.set(0, halfheight, 0);
    group.add(top);

    const bottom = new Mesh(wedge, this.chromematerial);
    bottom.position.set(0, -halfheight, 0);
    bottom.rotation.z = MathUtils.degToRad(180)
    group.add(bottom);

    const left = new Mesh(wedge, this.chromematerial);
    left.position.set(-halfwidth, 0, 0);
    left.rotation.z = MathUtils.degToRad(90)
    group.add(left);

    const right = new Mesh(wedge, this.chromematerial);
    right.position.set(halfwidth, 0, 0);
    right.rotation.z = MathUtils.degToRad(-90)
    group.add(right);

    scene.add(group);
  }
}
