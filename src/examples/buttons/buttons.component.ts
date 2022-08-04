import { Component } from "@angular/core";
import { Object3D } from "three";

@Component({
  templateUrl: './buttons.component.html',
})
export class ButtonsExample {
  list: Array<Object3D> = [];
}
