import { AfterViewInit, Component, Input } from "@angular/core";

import { Mesh, MeshBasicMaterial, Texture, TextureLoader } from "three";
import { NgtLoader, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { InteractiveObjects } from "../../../../../dist/ng3-flat-ui";

@Component({
  selector: 'flat-ui-basic-image',
  exportAs: 'flatUIBasicImage',
  templateUrl: './basic-image.component.html',
})
export class FlatUIBasicImage extends NgtObjectProps<Mesh> implements AfterViewInit {
  @Input()
  set map(newvalue: string) {
      const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
        this.maptexture = next;
      },
        () => { },
        () => { s.unsubscribe(); }
      );
  }
  @Input() maptexture!: Texture;

  @Input()
  set lightMap(newvalue: string) {
    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.lightMaptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() lightMaptexture!: Texture;

  @Input()
  set aoMap(newvalue: string) {
    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.aoMaptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() aoMaptexture!: Texture;

  //@Input()
  //set emissiveMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.emissiveMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() emissiveMaptexture!: Texture;

  //@Input()
  //set bumpMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.bumpMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() bumpMaptexture!: Texture;

  //@Input()
  //set normalMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.normalMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() normalMaptexture!: Texture;

  //@Input()
  //set displacementMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.displacementMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() displacementMaptexture!: Texture;

  //@Input()
  //set roughnessMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.roughnessMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() roughnessMaptexture!: Texture;

  //@Input()
  //set metalnessMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.metalnessMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() metalnessMaptexture!: Texture;


  @Input()
  set alphaMap(newvalue: string) {
    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.alphaMaptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() alphaMaptexture!: Texture;

  @Input()
  set envMap(newvalue: string) {
    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.envMaptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() envMaptexture!: Texture;


  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  @Input() selectable?: InteractiveObjects;

  material!: MeshBasicMaterial;
  protected mesh!: Mesh;

  constructor(private loader: NgtLoader) { super(); }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  protected meshready(mesh: Mesh, material: MeshBasicMaterial) {
    this.selectable?.add(mesh);

    this.mesh = mesh;
    this.material = material;
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

}
