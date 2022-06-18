import { Component } from "@angular/core";

@Component({
  templateUrl: './teleport.component.html',
})
export class TeleportExample {
  showcontroller = true;
  trackpointer = true;
  teleport = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.teleport = !this.teleport }, 5000);
  }
}
