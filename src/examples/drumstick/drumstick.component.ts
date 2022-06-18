import { Component } from "@angular/core";

@Component({
  templateUrl: './drumstick.component.html',
})
export class DrumstickExample  {
  enabled = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);
  }
}
