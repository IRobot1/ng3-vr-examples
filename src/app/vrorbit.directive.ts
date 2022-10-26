import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";
import { NgtSobaOrbitControls } from "@angular-three/soba/controls";

import { WebVRService } from "ng3-webxr";


@Directive({
  selector: '[vrorbit]',
})
export class VROrbitDirective implements OnInit, OnDestroy {
  private _orbitEnabled: BooleanInput = true;
  @Input()
  get vrorbit(): boolean { return coerceBooleanProperty(this._orbitEnabled) }
  set vrorbit(newvalue: BooleanInput) {
    this._orbitEnabled = newvalue;
  }

  private subs = new Subscription();

  constructor(
    private webvr: WebVRService,
    private orbit: NgtSobaOrbitControls,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.orbit) return;

    this.subs.add(this.webvr.xrsession.subscribe(isPresenting => {
      this.orbit.instance.value.enabled = !isPresenting;
    }));
  }
}
