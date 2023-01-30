import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { BoxGeometry, BufferGeometry, ExtrudeGeometry, MeshBasicMaterial, Shape, ShapeGeometry, Vector2 } from "three";

import { ColumnData } from "./column-chart/column-chart.component";

@Component({
  templateUrl: './data-visuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataVisualsExample implements OnInit {
  arrow!: BufferGeometry;
  width = 4 / 3

  arrowdata: Array<ColumnData> = [
    { label: '2017', value: 0.5, geometry: this.arrow, material: new MeshBasicMaterial({ color: '#F9458E' }) },
    { label: '2018', value: 0.6, geometry: this.arrow, material: new MeshBasicMaterial({ color: 'seagreen' }) },
    { label: '2019', value: 0.7, geometry: this.arrow, material: new MeshBasicMaterial({ color: 'gold' }) },
    { label: '2020', value: 0.8, geometry: this.arrow, material: new MeshBasicMaterial({ color: 'cornflowerblue' }) },
    { label: '2021', value: 0.9, geometry: this.arrow, material: new MeshBasicMaterial({ color: '#716EC9' }) },
  ]

  ngOnInit(): void {
    const shape = this.createArrowShape(0.1, 1);
    this.arrow = new ShapeGeometry(shape);

    this.arrowdata.forEach(item => {
      item.geometry = new ExtrudeGeometry(this.createArrowShape(0.06, item.value - 0.2), { bevelEnabled: false, depth: 0.04, bevelSize: 0.01 });
      item.geometry.translate(0, 0, -0.02) // change center
      //item.geometry = new BoxGeometry(0.2, item.value / 2, 0.03);
      //item.geometry.translate(0, item.value / 4, 0) // change center

      item.displayvalue = `${item.value * 100} %`
      //item.minorlabel = 'some small subtext that should wrap after a while some small subtext that should wrap after a while'

    });
  }


  createArrowShape(width: number, height: number): Shape {
    const points: Array<Vector2> = []
    points.push(new Vector2(0, 0))
    points.push(new Vector2(width, 0))
    points.push(new Vector2(width, height))
    points.push(new Vector2(width * 2, height))
    points.push(new Vector2(0, height + width * 2))
    points.push(new Vector2(-width * 2, height))
    points.push(new Vector2(-width, height))
    points.push(new Vector2(-width, 0))
    points.push(new Vector2(0, 0))
    return new Shape(points);
  }
}
