import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Group, Scene, WebXRManager } from "three";

@Injectable({
  providedIn: 'root'
})
export class WebARService {
  public isPresenting = new BehaviorSubject<boolean>(false);

  public manager!: WebXRManager;

  public finger1Controller!: Group;
  public finger2Controller!: Group;

  public dispose!: () => void;

  start(xr: WebXRManager, scene: Scene, spacetype: XRReferenceSpaceType): void {
    // this will fail if type isn't supported by device
    xr.setReferenceSpaceType(spacetype);

    console.log('WebAR service starting');

    const sessionstart = () => this.isPresenting.next(true);
    xr.addEventListener('sessionstart', sessionstart)

    const sessionend = () => this.isPresenting.next(false);
    xr.addEventListener('sessionend', sessionend)

    this.finger1Controller = xr.getController(0);
    scene.add(this.finger1Controller);

    this.finger2Controller = xr.getController(1);
    scene.add(this.finger2Controller);

    this.manager = xr;

    this.dispose = () => {
      scene.remove(this.finger1Controller);
      scene.remove(this.finger2Controller);
      xr.removeEventListener('sessionstart', sessionstart);
      xr.removeEventListener('sessionend', sessionend);
    }
  }
}
