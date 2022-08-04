import { NgtSobaText } from "@angular-three/soba/abstractions";
import { Component, ViewChild } from "@angular/core";
import { XRHandSpace } from "three";
import { HandModelType } from "./showhand.directive";

@Component({
  templateUrl: './hand.component.html',
})
export class HandInputExample {

  showhand = true;
  handinput = true;

  modeltype : HandModelType = 'boxes';

  text = ''

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.handinput = !this.handinput }, 5000);
  }


  log(event: string, data: XRHandSpace) {
    //console.warn(event, data);
  }

  pinch(data: XRHandSpace) {
    if (this.modeltype == 'boxes') {
      this.modeltype = 'spheres'
    }
    else if (this.modeltype == 'spheres') {
      this.modeltype = 'boxes';
    }
  }
}
