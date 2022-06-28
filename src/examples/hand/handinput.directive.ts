import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";
import { Subject } from "rxjs";

@Directive({
  selector: '[handinput]',
})
export class HandinputDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get handinput(): boolean { return coerceBooleanProperty(this._enabled) }
  set handinput(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  public pinchstart = new Subject<XRInputSource>()
  public pinch = new Subject<XRInputSource>()
  public pinchend = new Subject<XRInputSource>()

  private cleanup = () => { }

  constructor(
    private xr: VRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.cleanup();
  }

  ngOnInit(): void {

    this.xr.sessionstart.subscribe(xrmanager => {

      if (!xrmanager) return;

      const hand = xrmanager.getHand(this.xr.index);

      const pinchstartHandler = (event: any) => {
        if (this.handinput) {
          console.warn('pinchstart', event)
          const data: XRInputSource = event['data'];
          this.pinchstart.next(data);
        }
      }

      hand.addEventListener('pinchstart', pinchstartHandler);

      const pinchendHandler = (event: any) => {
        if (this.handinput) {
          const data: XRInputSource = event['data'];
          this.pinchend.next(data);
        }
      }
      hand.addEventListener('pinchend', pinchendHandler);

      const pinchHandler = (event: any) => {
        if (this.handinput) {
          console.warn('pinch', event)
          const data: XRInputSource = event['data'];
          this.pinch.next(data);
        }
      }
      hand.addEventListener('pinch', pinchHandler);

      this.cleanup = () => {
        hand.removeEventListener('pinchstart', pinchstartHandler);
        hand.removeEventListener('pinchend', pinchendHandler);
        hand.removeEventListener('pinch', pinchHandler);
      }
    });

    //this.xr.connected.subscribe(next => {
    //  if (!next) return;

    //  if (this.handinput) {
    //  }
    //});
  }
}
