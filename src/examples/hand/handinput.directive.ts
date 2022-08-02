import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { XRHandSpace } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";
import { Subscription } from "rxjs";

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

  @Output() pinchstart = new EventEmitter<XRHandSpace>()
  @Output() pinchend = new EventEmitter<XRHandSpace>()
  @Output() pinch = new EventEmitter<XRHandSpace>()
  @Output() handRender = new EventEmitter<XRHandSpace>()

  private cleanup = () => { }
  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.xr.sessionstart.subscribe(xrmanager => {

      if (!xrmanager) return;

      const hand = xrmanager.getHand(this.xr.index);

      const pinchstartHandler = (event: any) => {
        if (this.handinput) {
          this.pinchstart.next(event.target);
        }
      }

      hand.addEventListener('pinchstart', pinchstartHandler);

      const pinchendHandler = (event: any) => {
        if (this.handinput) {
          this.pinchend.next(event.target);
          this.pinch.next(event.target);
        }
      }
      hand.addEventListener('pinchend', pinchendHandler);

      this.subs.add(this.xr.beforeRender.subscribe(next => {
        if (this.handRender.observed) {
          this.handRender.next(xrmanager.getHand(this.xr.index));
        }
      }));

      this.cleanup = () => {
        hand.removeEventListener('pinchstart', pinchstartHandler);
        hand.removeEventListener('pinchend', pinchendHandler);
      }
    }));


  }
}
