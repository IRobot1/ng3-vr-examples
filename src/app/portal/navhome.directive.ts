import { Directive, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "../../examples/xr-controller/vr-controller.component";

@Directive({
  selector: '[navhome]',
})
export class NavigateHomeDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get navhome(): boolean { return coerceBooleanProperty(this._enabled) }
  set navhome(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
    private router: Router,
    private zone: NgZone,
  ) { }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.xr.grip.subscribe(next => {
      if (this.navhome) {
        this.zoneNavigate();
      }
    }));
  }

  private zoneNavigate() {
    this.zone.run(() => {
      this.router.navigate(['/']);
    });
  }
}
