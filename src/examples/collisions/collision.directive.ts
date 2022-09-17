import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Mesh } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";
import { NgtMesh } from "@angular-three/core/meshes";

import { CollideHint, CollisionGroup } from "./collision";

@Directive({
  selector: '[collision]',
  exportAs: 'collision',
})
export class CollisionDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get collision(): boolean { return coerceBooleanProperty(this._enabled) }
  set collision(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  @Input() collisionGroup!: CollisionGroup;
  @Input() collisionType: CollideHint = 'box'

  @Output() collidebegin = new EventEmitter<Mesh>()
  @Output() colliding = new EventEmitter<Mesh>()
  @Output() collideend = new EventEmitter<Mesh>()

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private collider: NgtMesh,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.cleanup();
  }

  ngOnInit(): void {
    if (!this.collisionGroup) {
      console.warn('collision directive missing collisionGroup input');
      return;
    }

    let mesh = this.collider.instance.value;
    this.collisionGroup.addCollider(mesh, this.collisionType);

    const collidebegin = (event: any) => {
      if (this.collision)
        this.collidebegin.next(event.target);
    }
    mesh.addEventListener('collidebegin', collidebegin);

    const colliding = (event: any) => {
      if (this.collision)
        this.colliding.next(event.target);
    }
    mesh.addEventListener('colliding', colliding);

    const collideend = (event: any) => {
      if (this.collision)
        this.collideend.next(event.target);
    }
    mesh.addEventListener('collideend', collideend);


    this.cleanup = () => {
      mesh.removeEventListener('collidebegin', collidebegin);
      mesh.removeEventListener('colliding', colliding);
      mesh.removeEventListener('collideend', collideend);
      this.collisionGroup.removeCollider(mesh);
    }
  }
}
