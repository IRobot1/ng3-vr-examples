import { Component } from "@angular/core";

@Component({
  templateUrl: './hand.component.html',
})
export class HandInputExample {
  showhand = true;
  handinput = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    setInterval(() => { this.handinput = !this.handinput }, 5000);
  }
}
