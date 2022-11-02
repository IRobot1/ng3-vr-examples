import { Component } from "@angular/core";
import { InteractiveObjects } from "../../../dist/ng3-flat-ui";

@Component({
  templateUrl: './data-grid.component.html',
})
export class DataGridExample {
  datasource = [
    { name: 'red', r: 255, g: 0, b: 0 },
    { name: 'green', r: 0, g: 255, b: 0 },
    { name: 'blue', r: 0, g: 0, b: 255 },
    { name: 'magenta', r: 170, g: 0, b: 255 },
    { name: 'gray', r: 50, g: 50, b: 50 },
    { name: 'aqua', r: 0, g: 255, b: 255 },
  ];

  selectable = new InteractiveObjects();;

}
