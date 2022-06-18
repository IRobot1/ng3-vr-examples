import { Component } from "@angular/core";

@Component({
  templateUrl: './joystick.component.html',
})
export class JoystickExample {
  enabled = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);
  }
}
