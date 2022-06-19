import { Injectable } from "@angular/core";

import { BehaviorSubject, Subject } from "rxjs";

import { Group, Scene, WebXRManager } from "three";


export class ConnectedEvent {
  constructor(public controller: Group, public xrinput: XRInputSource) { }
}

export class WebXRController {
  public connected = new BehaviorSubject<XRInputSource | undefined>(undefined)
  public disconnected = new Subject<boolean>()

  public dispose!: () => void;

  constructor(public controller: Group) {
    const connected = (event: any) => {
      this.connected.next(event['data']);
    }
    this.controller.addEventListener('connected', connected);

    const disconnected = (event: any) => {
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
export class WebXRService {
  public xrsession = new BehaviorSubject<boolean>(false);

  public manager!: WebXRManager;

  public left!: WebXRController;
  public right!: WebXRController;

  public dispose!: () => void;

  start(xr: WebXRManager, scene: Scene): void {
    console.log('WebXR service starting');

    const sessionstart = (event: any) => this.xrsession.next(true);
    xr.addEventListener('sessionstart', sessionstart)

    const sessionend = (event: any) => this.xrsession.next(false);
    xr.addEventListener('sessionend', sessionend)

    const left = xr.getController(0);
    scene.add(left);
    this.left = new WebXRController(left)

    const right = xr.getController(1);
    scene.add(right);
    this.right = new WebXRController(right)

    this.manager = xr;

    this.dispose = () => {
      scene.remove(left);
      scene.remove(right);
      xr.removeEventListener('sessionstart', sessionstart);
      xr.removeEventListener('sessionend', sessionend);
      this.left.dispose();
      this.right.dispose();
    }
  }
}
