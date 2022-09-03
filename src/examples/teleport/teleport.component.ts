import { Component } from "@angular/core";
import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './teleport.component.html',
})
export class TeleportExample {
  showcontroller = true;
  trackpointer = true;
  teleport = true;

  constructor(private cameraService: CameraService) {
    this.cameraService.position = [0, 1.5, 1];

    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.teleport = !this.teleport }, 5000);
  }
}
