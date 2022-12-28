import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: './shapeware.component.html',
})
export class ShapewareExample implements OnInit {
  width = 0.8
  height = 0
  variablename = ''

  log(text: string, data: any) {
    console.warn(text, data)
  }

  ngOnInit(): void {
    let widthchange = 0.1;
    let heightchange = 0.1;
    let count = 1;

    setInterval(() => {
      if (this.width > 2 || this.width < 0.8)
        widthchange = -widthchange;
      this.width += widthchange;

      if (this.height > 1 || this.height < 0.1)
        heightchange = -heightchange;
      this.height += heightchange;

      this.variablename = 'MyVariable' + count++;
    }, 1000)
  }

}
