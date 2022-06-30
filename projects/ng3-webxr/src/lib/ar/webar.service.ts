import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Group, Scene, WebXRManager } from "three";

@Injectable({
  providedIn: 'root'
})
export class WebARService {
  public isPresenting = new BehaviorSubject<boolean>(false);

  public manager!: WebXRManager;

  public controller!: Group;

  public dispose!: () => void;

  start(xr: WebXRManager, scene: Scene, spacetype: XRReferenceSpaceType): void {
    // this will fail if type isn't supported by device
    xr.setReferenceSpaceType(spacetype);

    console.log('WebAR service starting');

    const sessionstart = () => this.isPresenting.next(true);
    xr.addEventListener('sessionstart', sessionstart)

    const sessionend = () => this.isPresenting.next(false);
    xr.addEventListener('sessionend', sessionend)

    this.controller = xr.getController(0);
    scene.add(this.controller);

    this.manager = xr;

    this.dispose = () => {
      scene.remove(this.controller);
      xr.removeEventListener('sessionstart', sessionstart);
      xr.removeEventListener('sessionend', sessionend);
    }
  }
}
