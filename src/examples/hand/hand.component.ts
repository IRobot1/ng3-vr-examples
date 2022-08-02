import { Component } from "@angular/core";
import { XRHandSpace } from "three";

@Component({
  templateUrl: './hand.component.html',
})
export class HandInputExample {
  showhand = true;
  handinput = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.handinput = !this.handinput }, 5000);
  }

  log(event: string, data: XRHandSpace) {
    console.warn(event, data);
  }
}
