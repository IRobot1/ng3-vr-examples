import { Component } from "@angular/core";
import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './teleport.component.html',
})
export class TeleportExample {
  showcontroller = true;
  trackpointer = true;
  teleport = true;

  stage = new Array(9).fill(false);

  constructor(private cameraService: CameraService) {
    this.cameraService.position = [0, 1.5, 1];

    let stage = 0;
    const timer = setInterval(() => {
      this.stage[stage] = true;
      stage++;
      if (stage > 8) clearInterval(timer);
    }, 1250)
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.teleport = !this.teleport }, 5000);
  }
}
