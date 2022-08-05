import { EventEmitter, Output, Directive, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Object3D, VectorKeyframeTrack } from 'three';
import { BooleanInput, coerceBooleanProperty, NgtStore } from '@angular-three/core';

import { MeshBoxButtonComponent } from './mesh-box-button/mesh-box-button.component';


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

  @Output() animateCompleted = new EventEmitter<Object3D>();

  private clicktime = 0.1;

  private positionKF!: VectorKeyframeTrack;

  private clip!: AnimationClip;
  private mixer!: AnimationMixer;
  private action!: AnimationAction;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private buttonObject: MeshBoxButtonComponent,
    private store: NgtStore,
  ) { }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngAfterViewInit(): void {

    let object: Object3D;

    const onFinished = () => {
      this.animateCompleted.emit(object);
    }


    this.subs.add(this.buttonObject.buttonSelected.subscribe(next => {
      if (this.animateclick) {
        if (!this.mixer) {
          this.mixer = new AnimationMixer(next.object);
          this.mixer.addEventListener('finished', onFinished);

          const p = this.buttonObject.position;
          const distance = this.buttonObject.scale[1] / 5;
          this.positionKF = new VectorKeyframeTrack('.position', [0, this.clicktime * 2 / 3, this.clicktime], [
            p[0], p[1], p[2],
            p[0], p[1]-distance, p[2],
            p[0], p[1], p[2],
          ]);

          this.clip = new AnimationClip('Action', this.clicktime, [this.positionKF]);
          object = next.data;
        }

        this.action = this.mixer.clipAction(this.clip);
        this.action.loop = LoopOnce;
        this.startanimation();
      }
    }));

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
