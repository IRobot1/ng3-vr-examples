import { EventEmitter, Output, Directive, OnDestroy, OnInit, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, VectorKeyframeTrack } from 'three';
import { BooleanInput, coerceBooleanProperty, NgtRenderState } from '@angular-three/core';
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

  @Output() buttonClicked = new EventEmitter<boolean>();

  private clicktime = 0.1;

  private positionKF = new VectorKeyframeTrack('.position', [0, this.clicktime * 2 / 3, this.clicktime], [
    0, 0, 0,
    0, -0.05, 0,
    0, 0, 0,
  ]);

  private clip = new AnimationClip('Action', this.clicktime, [this.positionKF]);
  private mixer!: AnimationMixer;
  private action!: AnimationAction;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private buttonObject: MeshBoxButtonComponent,
  ) { }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngAfterViewInit(): void {
    console.warn('animate click after view init')

    this.mixer = new AnimationMixer(this.buttonObject.object.instance.value);
    const onFinished = () => {
      this.buttonClicked.emit(true);
    }
    this.mixer.addEventListener('finished', onFinished);

    this.cleanup = () => {
      this.mixer.removeEventListener('finished', onFinished);
    }

    this.subs.add(this.buttonObject.object.click.subscribe(next => {
      if (this.animateclick) {
        this.action = this.mixer.clipAction(this.clip);
        this.action.loop = LoopOnce;
        this.startanimation();
      }
    }));

    this.subs.add(this.buttonObject.object.beforeRender.subscribe(next => {
      if (this.animateclick) {
        if (this.mixer && this.action.isRunning()) {
          this.tick(next.state);
        }
      }
    }));

  }

  startanimation() {
    this.action.reset();
    this.action.play();
  }

  tick({ delta }: NgtRenderState) {
    this.mixer.update(delta);
  }
}
