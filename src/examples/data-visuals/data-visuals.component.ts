import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { BoxGeometry, BufferGeometry, ExtrudeGeometry, MathUtils, MeshBasicMaterial, Path, RingGeometry, Shape, ShapeGeometry, Vector2 } from "three";

import { ColumnData } from "./column-chart/column-chart.component";
import { LineData } from "./line-plot/line-plot.component";
import { PieData } from "./pie-chart/pie-chart.component";
import { StackData } from "./stacked-bar/stacked-bar.component";

@Component({
  templateUrl: './data-visuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataVisualsExample implements OnInit {
  temp!: BufferGeometry;
  width = 1.6;
  height = 1;
  piespacing = 0.02;

  pink = new MeshBasicMaterial({ color: '#F9458E' });
  seagreen = new MeshBasicMaterial({ color: 'seagreen' });
  gold = new MeshBasicMaterial({ color: 'gold' });
  cornflowerblue = new MeshBasicMaterial({ color: 'cornflowerblue' });
  purple = new MeshBasicMaterial({ color: '#716EC9' });

  arrowdata: Array<ColumnData> = [
    { label: '2017', value: 10.35, geometry: this.temp, material: this.pink },
    { label: '2018', value: 20.45, geometry: this.temp, material: this.seagreen },
    { label: '2019', value: 28.60, geometry: this.temp, material: this.gold },
    { label: '2020', value: 41.56, geometry: this.temp, material: this.cornflowerblue },
    { label: '2021', value: 52.32, geometry: this.temp, material: this.purple },
  ]


  boxdata: Array<ColumnData> = [
    { label: '', value: 43, geometry: this.temp, material: this.pink },
    { label: '', value: 24, geometry: this.temp, material: this.cornflowerblue },
    { label: '', value: 12, geometry: this.temp, material: this.gold },
    { label: '', value: 39, geometry: this.temp, material: this.purple },
    { label: '', value: 14, geometry: this.temp, material: this.seagreen },
  ]

  ringdata: Array<ColumnData> = [
    { label: '', value: 67, geometry: this.temp, material: this.pink },
    { label: '', value: 53, geometry: this.temp, material: this.gold },
    { label: '', value: 28, geometry: this.temp, material: this.seagreen },
    { label: '', value: 79, geometry: this.temp, material: this.purple },
  ]

  rectangledata: Array<ColumnData> = [
    { label: '2017', value: 10, geometry: this.temp, material: this.cornflowerblue },
    { label: '2018', value: 40, geometry: this.temp, material: this.pink },
    { label: '2019', value: 50, geometry: this.temp, material: this.gold },
    { label: '2020', value: 30, geometry: this.temp, material: this.seagreen },
    { label: '2021', value: 70, geometry: this.temp, material: this.purple },
  ]

  piedata: Array<PieData> = [
    { label: '', value: 31, labelsize: 0.07, material: this.gold },
    { label: '', value: 12, labelsize: 0.05, material: this.pink },
    { label: '', value: 10, labelsize: 0.04, material: this.seagreen },
    { label: '', value: 47, labelsize: 0.07, material: this.purple },
  ]

  stackdata: Array<StackData> = []
  xstackdata: Array<StackData> = [
    { label: '', value: 42, material: this.cornflowerblue },
    { label: '', value: 36, material: this.purple },
    { label: '', value: 12, material: this.pink },
    { label: '', value: 21, material: this.gold },
    { label: '', value: 27, material: this.seagreen },
  ]
  ystackdata: Array<StackData> = [
    { label: '', value: 12, material: this.pink },
    { label: '', value: 21, material: this.gold },
    { label: '', value: 36, material: this.purple },
    { label: '', value: 42, material: this.cornflowerblue },
  ]

  linedata: LineData =
    {
      label: '', values: [
        <Vector2>{ x: 1, y: 2 },
        <Vector2>{ x: 3.5, y: 5.5 },
        <Vector2>{ x: 6, y: 3 },
        <Vector2>{ x: 8.5, y: 8 },
        <Vector2>{ x: 10.5, y: 5.5 },
        <Vector2>{ x: 13, y: 3 },
        <Vector2>{ x: 14.5, y: 8 },
      ], material: this.gold
    }

  areadata: LineData =
    {
      label: '', values: [
        <Vector2>{ x: 1, y: 0 },
        <Vector2>{ x: 2, y: 2 },
        <Vector2>{ x: 3, y: 1 },
        <Vector2>{ x: 5, y: 4 },
        <Vector2>{ x: 6, y: 5 },
        <Vector2>{ x: 7, y: 8 },
        <Vector2>{ x: 8, y: 7 },
        <Vector2>{ x: 9, y: 4 },
        <Vector2>{ x: 10, y: 3 },
        <Vector2>{ x: 11, y: 7 },
        <Vector2>{ x: 12, y: 8 },
        <Vector2>{ x: 13, y: 7 },
        <Vector2>{ x: 14, y: 6 },
        <Vector2>{ x: 15, y: 4 },
        <Vector2>{ x: 16, y: 3 },
        <Vector2>{ x: 17, y: 2 },
        <Vector2>{ x: 18, y: 5 },
        <Vector2>{ x: 19, y: 3 },
        <Vector2>{ x: 20, y: 0 },
      ], material: this.pink
    }

  smootharea1: LineData =
    {
      label: '', values: [
        <Vector2>{ x: 1, y: 0 },
        <Vector2>{ x: 2, y: 2 },
        <Vector2>{ x: 3, y: 1 },
        <Vector2>{ x: 5, y: 4 },
        <Vector2>{ x: 6, y: 3 },
        <Vector2>{ x: 7, y: 7 },
        <Vector2>{ x: 8, y: 2 },
        <Vector2>{ x: 9, y: 4 },
        <Vector2>{ x: 10, y: 2 },
        <Vector2>{ x: 11, y: 3 },
        <Vector2>{ x: 12, y: 0 },
      ], material: this.gold
    }

  smootharea2: LineData =
    {
      label: '', values: [
        <Vector2>{ x: 1, y: 0 },
        <Vector2>{ x: 2, y: 3 },
        <Vector2>{ x: 3, y: 1 },
        <Vector2>{ x: 4, y: 4 },
        <Vector2>{ x: 5, y: 8 },
        <Vector2>{ x: 6, y: 5 },
        <Vector2>{ x: 7, y: 7 },
        <Vector2>{ x: 8, y: 4 },
        <Vector2>{ x: 9, y: 6 },
        <Vector2>{ x: 10, y: 3 },
        <Vector2>{ x: 11, y: 0 },
      ], material: this.pink
    }

  smootharea3: LineData =
    {
      label: '', values: [
        <Vector2>{ x: 1, y: 0 },
        <Vector2>{ x: 2, y: 3 },
        <Vector2>{ x: 3, y: 2 },
        <Vector2>{ x: 5, y: 5 },
        <Vector2>{ x: 6, y: 2 },
        <Vector2>{ x: 7, y: 4 },
        <Vector2>{ x: 8, y: 2 },
        <Vector2>{ x: 9, y: 3.5 },
        <Vector2>{ x: 10, y: 3 },
        <Vector2>{ x: 11, y: 2 },
        <Vector2>{ x: 12, y: 3 },
        <Vector2>{ x: 13, y: 0 },
      ], material: this.seagreen
    }



  protected arrowtext(data: ColumnData) {
    return `${data.value.toFixed(2)} %`
  }

  protected ringtext(data: ColumnData) {
    return `${data.value} %`
  }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const shape = this.createArrowShape(0.1, 1);
    this.temp = new ShapeGeometry(shape);

    this.arrowdata.forEach(item => {
      item.geometry = new ExtrudeGeometry(this.createArrowShape(0.06, item.value / 50), { bevelEnabled: false, depth: 0.04, bevelSize: 0.01 });
      item.geometry.translate(0, 0, -0.02) // change center
      //item.geometry = new BoxGeometry(0.2, item.value / 2, 0.03);
      //item.geometry.translate(0, item.value / 4, 0) // change center

      //item.minorlabel = 'some small subtext that should wrap after a while some small subtext that should wrap after a while'
    });

    const boxtotal = this.boxdata.map(x => x.value).reduce((accum, value) => accum + value);
    this.boxdata.forEach(item => {
      const width = item.value / boxtotal * 4 / 3;

      item.geometry = new BoxGeometry(width, 0.2, 0.4);
      item.geometry.translate(0, 0.1, 0) // change center

      item.label = `${item.value} %`;
    });


    this.ringdata.forEach(item => {
      item.geometry = new ExtrudeGeometry(this.createRingShape(0.125, 0.2, item.value / 100 * Math.PI * 2),
        { bevelEnabled: false, depth: 0.06, bevelSize: 0.01 })
      item.geometry.rotateX(MathUtils.degToRad(-90))

      item.label = `${item.value} %`;
    });

    this.rectangledata.forEach(item => {
      const height = item.value / 100 * this.height;
      item.geometry = new BoxGeometry(0.15, height, 0.15);
      item.geometry.translate(0, height / 2, 0); // change center

      (item as any)['minorlabel'] = 'Lorem ipsum dolor sit amet, consectetur';
    });


    this.piedata.forEach(item => {
      item.label = `${item.value} %`;
    });

    this.piedata.forEach(item => {
      item.label = `${item.value} %`;
    });

    this.xstackdata.forEach(item => {
      item.label = `${item.value} %`;
    });
    this.ystackdata.forEach(item => {
      item.label = `${item.value} %`;
    });

    this.stackdata = this.xstackdata;

  //  let index = 0;
  //  let linevalues = this.linedata.values;
  //  linevalues.length = 0;

  //  let areavalues = this.areadata.values;
  //  areavalues.length = 0;

  //  let smooth1 = this.smootharea1.values;
  //  smooth1.length = 0;
  //  let smooth2 = this.smootharea2.values;
  //  smooth2.length = 0;
  //  let smooth3 = this.smootharea3.values;
  //  smooth3.length = 0;

  //  setInterval(() => {
  //    for (let i = 0; i < 1; i++) {
  //      const value = Math.sin(index) * 10;

  //      if (linevalues.length > 100) {
  //        linevalues.shift();
  //      }
  //      linevalues.push(<Vector2>{ x: index, y: value });

  //      if (areavalues.length > 100) {
  //        areavalues.shift();
  //      }
  //      areavalues.push(<Vector2>{ x: index, y: value });

  //      if (smooth1.length > 100) {
  //        smooth1.shift();
  //      }
  //      smooth1.push(<Vector2>{ x: index, y: value });

  //      if (smooth2.length > 100) {
  //        smooth2.shift();
  //      }
  //      smooth2.push(<Vector2>{ x: index, y: value });

  //      if (smooth3.length > 100) {
  //        smooth3.shift();
  //      }
  //      smooth3.push(<Vector2>{ x: index, y: value });

  //      index += 0.1;
  //    }
  //    this.redraw = !this.redraw;
  //    //  this.segments++;
  //    //  if (this.segments == 20) this.segments = 3;
  //    //    if (this.stackdata == this.xstackdata) {
  //    //      this.stackdata = this.ystackdata
  //    //      this.segments = 4;
  //    //    }
  //    //    else {
  //    //      this.stackdata = this.xstackdata
  //    //      this.segments = 3;
  //    //    }
  //  }, 1000 / 60)
  }
  segments = 4
  redraw = false;

  createRingShape(innerradius: number, outerradius: number, endradians: number): Shape {
    const shape = new Shape()
      .moveTo(outerradius, 0)

    const inner: Array<Vector2> = []

    const segment = endradians / 36;
    for (let angle = 0; angle <= endradians; angle += segment) {
      const outerx = outerradius * Math.cos(angle)
      const outery = outerradius * Math.sin(angle)

      shape.lineTo(outerx, outery);

      inner.push(new Vector2(innerradius * Math.cos(angle), innerradius * Math.sin(angle)));
    }
    inner.reverse().forEach(item => shape.lineTo(item.x, item.y));
    shape.closePath();

    return shape;
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
