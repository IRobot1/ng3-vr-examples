import { EventEmitter, Directive, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Object3D } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { ShowHandDirective } from "./showhand.directive";
import { VRControllerComponent } from "ng3-webxr";


@Directive({
  selector: '[handgesture]',
  exportAs: 'handGesture',
})
export class HandGestureDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get handgesture(): boolean { return coerceBooleanProperty(this._enabled) }
  set handgesture(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  @Input() gestures: Array<{ name: string, vectors: Array<number> }> = [];

  @Output() gesture = new EventEmitter<string>();
  @Output() message = new EventEmitter<string>();

  private wrist!: Object3D;
  private tips: Array<{ name: string, object: Object3D }> = [];

  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
    private showhand: ShowHandDirective,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  ngOnInit(): void {
    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;

      if (this.gestures.length == 0) {
        console.warn(`Warning: ${next?.xrinput.handedness} handgesture directive [gestures] input is empty`);
      }
    }));

    const tipnames = ['index-finger-tip', 'middle-finger-tip', 'pinky-finger-tip', 'ring-finger-tip', 'thumb-tip'];
    this.showhand.handJoints.subscribe(joints => {
      this.tips.length = 0;

      this.wrist = joints['wrist'];
      tipnames.forEach(name => {
        this.tips.push({ name: name, object: joints[name] });
      });
    });

    this.monitor();
  }

  private monitor() {
    let prevname = '';
    setInterval(() => {
      const newname = this.guessGesture();
      if (newname && newname != prevname) {
        this.gesture.next(newname);
        prevname = newname;
      }
    }, 100);
  }



  private previous: Array<number> = [];
  private last = 100;

  captureGesture() {
    const positions: Array<number> = [];

    let distance = 0;
    this.tips.forEach((tip, index) => {
      let pos = this.wrist.position.clone().sub(tip.object.position);
      let length = pos.length();
      if (this.previous.length == this.tips.length) {
        const previous = this.previous[index];
        length = (length + previous) / 2;
      }
      else
        length = 1;

      positions.push(length);
      distance += length;
    });

    if (distance < this.last) {
      if (distance > 0) {
        console.warn('better distance', distance, this.last);
        this.previous = positions;
        console.warn(positions.join(','))
        this.last = distance;
      }
    }
    else {
      console.warn('worse distance', distance, this.last);
    }

  }

  guessGesture(): string | undefined {
    const positions: Array<number> = [];

    this.tips.forEach(tip => {
      positions.push(this.wrist.position.clone().sub(tip.object.position).length());
    });

    let bestmatch = 0;
    let name = '';
    this.gestures.forEach(gesture => {
      let match = 0;
      gesture.vectors.forEach((length, index) => {
        if (Math.abs(positions[index] - length) < 0.01) {
          match++;
        }
      });
      if (match > bestmatch) {
        bestmatch = match;
        name = gesture.name;
      }
    });
    if (bestmatch == 5) {
      return name;
    }
    return undefined;
  }
}
