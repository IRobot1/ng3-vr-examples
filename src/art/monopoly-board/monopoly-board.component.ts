import { Component, Input, OnInit } from "@angular/core";

import { BufferGeometry, DoubleSide, Path, Shape, ShapeGeometry, Side } from "three";
import { NgtTriple } from "@angular-three/core";


export type BoardCellType = 'corner' | 'property' | 'blank'

class BoardCell {
  constructor(public type: BoardCellType, public position: NgtTriple, public rotation: number, public color: string = 'white') { }
}

@Component({
  selector: 'monopoly-board',
  templateUrl: './monopoly-board.component.html',
})
export class MonopolyBoardComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() boardcolor = '#E3F1E4';

  cell: BufferGeometry;
  line: BufferGeometry;
  color: BufferGeometry;
  card: BufferGeometry;
  logo: BufferGeometry;

  side: Side = DoubleSide;

  private cells: Array<BoardCell> = [
    // top
    new BoardCell('corner', [7, 7, 0], 0),
    new BoardCell('property', [-2 / 3 * 8, 7, 0], 0, 'red'),
    new BoardCell('blank', [-2 / 3 * 6, 7, 0], 0),
    new BoardCell('property', [-2 / 3 * 4, 7, 0], 0, 'red'),
    new BoardCell('property', [-2 / 3 * 2, 7, 0], 0, 'red'),
    new BoardCell('blank', [0, 7, 0], 0),
    new BoardCell('property', [2 / 3 * 2, 7, 0], 0, 'yellow'),
    new BoardCell('property', [2 / 3 * 4, 7, 0], 0, 'yellow'),
    new BoardCell('blank', [2 / 3 * 6, 7, 0], 0),
    new BoardCell('property', [2 / 3 * 8, 7, 0], 0, 'yellow'),
    new BoardCell('corner', [-7, 7, 0], 0),

    // right side
    new BoardCell('property', [7, 2 / 3 * 8, 0], -90, 'green'),
    new BoardCell('property', [7, 2 / 3 * 6, 0], -90, 'green'),
    new BoardCell('blank', [7, 2 / 3 * 4, 0], -90),
    new BoardCell('property', [7, 2 / 3 * 2, 0], -90, 'green'),
    new BoardCell('blank', [7, 0, 0], -90),
    new BoardCell('blank', [7, -2 / 3 * 2, 0], -90),
    new BoardCell('property', [7, -2 / 3 * 4, 0], -90, 'blue'),
    new BoardCell('blank', [7, -2 / 3 * 6, 0], -90),
    new BoardCell('property', [7, -2 / 3 * 8, 0], -90, 'blue'),
    new BoardCell('corner', [7, -7, 0], 0),

    // bottom
    new BoardCell('property', [2 / 3 * 8, -7, 0], 180, 'purple'),
    new BoardCell('blank', [2 / 3 * 6, -7, 0], 180),
    new BoardCell('property', [2 / 3 * 4, -7, 0], 180, 'purple'),
    new BoardCell('blank', [2 / 3 * 2, -7, 0], 180),
    new BoardCell('blank', [0, -7, 0], 180),
    new BoardCell('property', [-2 / 3 * 2, -7, 0], 180, 'cyan'),
    new BoardCell('blank', [-2 / 3 * 4, -7, 0], 180),
    new BoardCell('property', [-2 / 3 * 6, -7, 0], 180, 'cyan'),
    new BoardCell('property', [-2 / 3 * 8, -7, 0], 180, 'cyan'),
    new BoardCell('corner', [-7, -7, 0], 0),

    // left side
    new BoardCell('property', [-7, -2 / 3 * 8, 0], 90, 'magenta'),
    new BoardCell('blank', [-7, -2 / 3 * 6, 0], 90),
    new BoardCell('property', [-7, -2 / 3 * 4, 0], 90, 'magenta'),
    new BoardCell('property', [-7, -2 / 3 * 2, 0], 90, 'magenta'),
    new BoardCell('blank', [-7, 0, 0], 90),
    new BoardCell('property', [-7, 2 / 3 * 2, 0], 90, 'orange'),
    new BoardCell('blank', [-7, 2 / 3 * 4, 0], 90),
    new BoardCell('property', [-7, 2 / 3 * 6, 0], 90, 'orange'),
    new BoardCell('property', [-7, 2 / 3 * 8, 0], 90, 'orange'),

  ];

  constructor() {
    let outer = 1;
    let inner = 0.95;

    let shape = new Shape()
      .moveTo(-outer, outer)
      .lineTo(outer, outer)
      .lineTo(outer, -outer)
      .lineTo(-outer, -outer)
      .lineTo(-outer, outer)

    let holePath = new Path()
      .moveTo(-inner, inner)
      .lineTo(-inner, -inner)
      .lineTo(inner, -inner)
      .lineTo(inner, inner)
      .lineTo(-inner, inner)

    shape.holes.push(holePath);
    this.cell = new ShapeGeometry(shape);


    shape = new Shape()
      .moveTo(-inner, 0.05)
      .lineTo(inner, 0.05)
      .lineTo(inner, 0)
      .lineTo(-inner, 0)
      .lineTo(-inner, 0.05)
    this.line = new ShapeGeometry(shape);

    shape = new Shape()
      .moveTo(-inner, 0.25)
      .lineTo(inner, 0.25)
      .lineTo(inner, 0)
      .lineTo(-inner, 0)
      .lineTo(-inner, 0.25)
    this.color = new ShapeGeometry(shape);
    this.color.center();

    shape = new Shape()
      .moveTo(-outer * 5, outer)
      .lineTo(outer * 5, outer)
      .lineTo(outer * 5, -outer)
      .lineTo(-outer * 5, -outer)
      .lineTo(-outer * 5, outer)
    this.logo = new ShapeGeometry(shape);
    this.logo.center();

    shape = new Shape()
      .moveTo(-outer * 1.5, outer)
      .lineTo(outer * 1.5, outer)
      .lineTo(outer * 1.5, -outer)
      .lineTo(-outer * 1.5, -outer)
      .lineTo(-outer * 1.5, outer)

    holePath = new Path()
      .moveTo(-inner * 1.5, inner)
      .lineTo(-inner * 1.5, -inner)
      .lineTo(inner * 1.5, -inner)
      .lineTo(inner * 1.5, inner)
      .lineTo(-inner * 1.5, inner)

    shape.holes.push(holePath);
    this.card = new ShapeGeometry(shape);


  }

  ngOnInit(): void {
  }

  get corners(): Array<BoardCell> {
    return this.cells.filter(cell => cell.type == 'corner');
  }

  get properties(): Array<BoardCell> {
    return this.cells.filter(cell => cell.type == 'property');
  }

  get blanks(): Array<BoardCell> {
    return this.cells.filter(cell => cell.type == 'blank');
  }
}
