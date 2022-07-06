import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Camera } from "three";

@Component({
  templateUrl: './studio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioExample {
  camera1!: Camera;
  camera2!: Camera;
}
