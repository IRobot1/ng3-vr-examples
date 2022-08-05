import { EventEmitter, Output, Directive, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Vector3, VectorKeyframeTrack } from 'three';
import { BooleanInput, coerceBooleanProperty, make, NgtStore } from '@angular-three/core';

import { NgtMesh } from '@angular-three/core/meshes';


@Directive({
  selector: '[animateclick]',
  exportAs: 'animateClick'
})
export class AnimateClickDirective implements OnDestroy, AfterViewInit {
  private _enabled: BooleanInput = true;
  @Input()
  get animateclick(): boolean { return coerceBooleanProperty(this._enabled) }
  set animateclick(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  @Output() animateCompleted = new EventEmitter();

  private clicktime = 0.1;

  private positionKF!: VectorKeyframeTrack;

  private clip!: AnimationClip;
  private mixer!: AnimationMixer;
  private action!: AnimationAction;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private buttonObject: NgtMesh,
    private store: NgtStore,
  ) { }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngAfterViewInit(): void {

    const onFinished = () => {
      this.animateCompleted.emit();
    }

    const animate = () => {
      if (this.animateclick) {
        if (!this.mixer) {
          this.mixer = new AnimationMixer(this.buttonObject.instance.value);
          this.mixer.addEventListener('finished', onFinished);

          const p = this.buttonObject.position;
          const px = p.x;
          const py = p.y;
          const pz = p.z;

          const scale = make(Vector3, this.buttonObject.scale);
          const distance = scale.y / 5;

          this.positionKF = new VectorKeyframeTrack('.position', [0, this.clicktime * 2 / 3, this.clicktime], [
            px, py, pz,
            px, py - distance, pz,
            px, py, pz,
          ]);

          this.clip = new AnimationClip('Action', this.clicktime, [this.positionKF]);
        }

        this.action = this.mixer.clipAction(this.clip);
        this.action.loop = LoopOnce;
        this.startanimation();
      }
    }

    // listen for click events 
    this.buttonObject.instance.value.addEventListener('click', animate);

    // TODO: change to use beforeRender
    const clock = this.store.get(s => s.clock);
    setInterval(() => {
      if (this.animateclick) {
        if (this.mixer && this.action.isRunning()) {
          this.tick(clock.getDelta());
        }
      }
    }, 1000/60)

    this.cleanup = () => {
      if (this.mixer) this.mixer.removeEventListener('finished', onFinished);
      this.buttonObject.instance.value.removeEventListener('click', animate);
    }
  }

  startanimation() {
    this.action.reset();
    this.action.play();
  }

  tick(delta: number) {
    this.mixer.update(delta);
  }
}
