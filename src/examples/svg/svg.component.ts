import { Component } from "@angular/core";

import { allsimpleicons } from "./simple-icons-data";

@Component({
  templateUrl: './svg.component.html',
})
export class SVGExample {
  url = '';
  svg = '';
  color = 'white'

  constructor() {
    let count = 0;
    setInterval(() => {
      const icon = allsimpleicons[count]
      if (icon) {
        this.svg = icon.svg;
        this.color = icon.color;
      }
      count++;
    }, 2500);

  }
}
