import { Component, Input, OnInit } from "@angular/core";

import { NgtTriple } from "@angular-three/core";


class ShiftData {
  constructor(public x: number, public y: number, public color: string) { }
}

@Component({
  selector: 'square-shift',
  templateUrl: './square-shift.component.html',
})
export class SquareShiftComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  cells: Array<ShiftData> = [];
  size = 0;


  ngOnInit(): void {
    const count = 16;
    this.size = 1 / count;

    const offsets = [0, 0.02, 0.05, 0.02]

    for (let row = 0; row <= count; row++) {
      const y = -0.5 + this.size * row + this.size / 2;
      const offset = offsets[row % 4];
      for (let column = 0; column < count; column++) {
        const x = -0.5 + this.size * column + offset + this.size / 2;
        if (column % 2 == 0) {
          this.cells.push(new ShiftData(x, y, 'black'));
        }
      }
    }
  }
}
