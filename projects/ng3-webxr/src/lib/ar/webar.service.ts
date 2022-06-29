import { Injectable } from "@angular/core";

import { BehaviorSubject, Subject } from "rxjs";

import { Group, Scene, WebXRManager } from "three";


export class WebARController {
  public connected = new BehaviorSubject<XRInputSource | undefined>(undefined)
  public disconnected = new Subject<boolean>()

  public dispose!: () => void;

  constructor(public controller: Group) {
    const connected = (event: any) => {
      this.connected.next(event['data']);
    }
    this.controller.addEventListener('connected', connected);

    const disconnected = () => {
      this.disconnected.next(true);
    }
    this.controller.addEventListener('disconnected', disconnected);

    this.dispose = () => {
      this.controller.removeEventListener('connected', connected);
      this.controller.removeEventListener('disconnected', disconnected);
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebARService {
  public xrsession = new BehaviorSubject<boolean>(false);

  public manager!: WebXRManager;

  public controller!: Group;

  public dispose!: () => void;

  start(xr: WebXRManager, scene: Scene, spacetype: XRReferenceSpaceType): void {
    // this will fail if type isn't supported by device
    xr.setReferenceSpaceType(spacetype);

    console.log('WebAR service starting');

    const sessionstart = () => this.xrsession.next(true);
    xr.addEventListener('sessionstart', sessionstart)

    const sessionend = () => this.xrsession.next(false);
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
