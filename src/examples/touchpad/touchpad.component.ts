import { Component } from "@angular/core";

@Component({
  templateUrl: './touchpad.component.html',
})
export class TouchpadExample {
  enabled = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);
  }

}
