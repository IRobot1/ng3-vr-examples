import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subject, Subscription } from "rxjs";

import { Group, Object3D, Vector2, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { WebXRService } from "./webxr.service";


export class ConnectedEvent {
  constructor(public controller: Group, public xrinput: XRInputSource) { }
}

@Component({
  selector: 'xr-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class XRControllerComponent implements OnInit, OnDestroy {
  @Input() index = 0;
  @Input() name = '';

  public sessionstart = new BehaviorSubject<WebXRManager | undefined>(undefined)

  public triggerstart = new Subject<XRInputSource>()
  public trigger = new Subject<XRInputSource>()
  public triggerend = new Subject<XRInputSource>()

  public gripstart = new Subject<XRInputSource>()
  public grip = new Subject<XRInputSource>()
  public gripend = new Subject<XRInputSource>()

  public touchpad = new Subject<boolean>()
  public touchpadaxis = new Subject<Vector2>()

  public joystick = new Subject<boolean>()
  public joystickaxis = new Subject<Vector2>()

  public connected = new BehaviorSubject<ConnectedEvent | undefined>(undefined)
  public disconnected = new Subject<boolean>()

  public beforeRender = new Subject<NgtRenderState>()

  private controller!: Group;
  private gamepad?: Gamepad;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private webxr: WebXRService,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.webxr.manager) {
      console.error('webxr directive missing from ngt-canvas');
      return;
    }
    const gl = this.store.get((s) => s.gl);

    this.subs.add(this.webxr.xrsession.subscribe(isPresenting => {
      if (isPresenting) {
        this.sessionstart.next(gl.xr);
      }
    }));

    let connected: BehaviorSubject<any>;
    let disconnected: Subject<boolean>;

    switch (this.index) {
      case 0:
        this.controller = this.webxr.left.controller;
        connected = this.webxr.left.connected;
        disconnected = this.webxr.left.disconnected;
        break;
      case 1:
        this.controller = this.webxr.right.controller;
        connected = this.webxr.right.connected;
        disconnected = this.webxr.right.disconnected;
        break;
      default:
        console.error('xr-controler unhandled index', this.index);
        return;
    }

    this.subs.add(connected.subscribe((event: XRInputSource) => {
      if (!event) return;
      this.controller.name = event.handedness;
      this.gamepad = event.gamepad;
      this.connected.next(new ConnectedEvent(this.controller, event));
    }));

    this.subs.add(disconnected.subscribe((event: boolean) => {
      if (!event) return;
      this.disconnected.next(true);
    }));

    const selectstart = (event: any) => {
      const data: XRInputSource = event['data'];
      this.triggerstart.next(data);
    }
    this.controller.addEventListener('selectstart', selectstart);

    const selectend = (event: any) => {
      this.trigger.next(event['data']);
      this.triggerend.next(event['data']);
    }
    this.controller.addEventListener('selectend', selectend);

    const squeezestart = (event: any) => {
      this.gripstart.next(event['data']);
    }
    this.controller.addEventListener('squeezestart', squeezestart);

    const squeezeend = (event: any) => {
      this.grip.next(event['data']);
      this.gripend.next(event['data']);
    }
    this.controller.addEventListener('squeezeend', squeezeend);

    this.cleanup = () => {
      this.controller.removeEventListener('squeezeend', squeezeend);
      this.controller.removeEventListener('squeezestart', squeezestart);
      this.controller.removeEventListener('selectend', selectend);
      this.controller.removeEventListener('selectstart', selectstart);
    }
  }

  touchpad_pressed = false;
  joystick_pressed = false;
  touchpad_axis = new Vector2();
  joystick_axis = new Vector2();

  tick(event: { state: NgtRenderState, object: Object3D }) {
    if (this.gamepad) {
      if (this.gamepad.buttons.length > 2) {
        // 6 Y B
        // 5 X A
        // 3 joystick press
        if (this.gamepad.buttons[2].pressed && !this.touchpad_pressed) {
          this.touchpad.next(true);
          this.touchpad_pressed = true;
        }
        else if (this.touchpad_pressed && !this.gamepad.buttons[2].pressed) {
          this.touchpad.next(false);
          this.touchpad_pressed = false;
        }
      }

      if (this.gamepad.buttons.length > 3) {
        if (this.gamepad.buttons[3].pressed && !this.joystick_pressed) {
          this.joystick.next(true);
          this.joystick_pressed = true;
        }
        else if (this.joystick_pressed && !this.gamepad.buttons[3].pressed) {
          this.joystick.next(false);
          this.joystick_pressed = false;
        }
      }

      if (this.touchpadaxis.observed) {
        this.touchpad_axis.x = this.gamepad.axes[0];
        this.touchpad_axis.y = this.gamepad.axes[1];
        this.touchpadaxis.next(this.touchpad_axis);
      }
      if (this.joystickaxis.observed) {
        this.joystick_axis.x = this.gamepad.axes[2];
        this.joystick_axis.y = this.gamepad.axes[3];
        this.joystickaxis.next(this.joystick_axis);
      }
    }
    if (this.beforeRender.observed) {
      this.beforeRender.next(event.state);
    }

  }
}
