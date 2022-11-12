import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, MeshBasicMaterial, Shape, Texture, TextureLoader } from "three";
import { NgtEvent, NgtLoader, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";
import { InteractiveObjects } from "../interactive-objects";

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

  //@Input()
  //set lightMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.lightMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() lightMaptexture!: Texture;

  //@Input()
  //set aoMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.aoMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() aoMaptexture!: Texture;

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


  //@Input()
  //set alphaMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.alphaMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() alphaMaptexture!: Texture;

  //@Input()
  //set envMap(newvalue: string) {
  //  const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
  //    this.envMaptexture = next;
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  //}
  //@Input() envMaptexture!: Texture;


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

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }

  @Input() enabled = false;

  @Input() selectable?: InteractiveObjects;

  @Output() pressed = new EventEmitter<void>();

  material!: MeshBasicMaterial;
  protected mesh!: Mesh;
  protected outline!: BufferGeometry; // outline material

  constructor(private loader: NgtLoader) { super(); }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  override ngOnInit() {
    super.ngOnInit();

    const halfwidth = this.width / 2;
    const halfheight = this.height / 2;

    const border = new Shape();
    border.moveTo(-halfwidth, halfheight)
    border.lineTo(halfwidth, halfheight)
    border.lineTo(halfwidth, -halfheight)
    border.lineTo(-halfwidth, -halfheight)
    border.closePath();

    this.outline = new BufferGeometry().setFromPoints(border.getPoints());
    this.outline.center();
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }

  protected meshready(mesh: Mesh, material: MeshBasicMaterial) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclick(); e.stop = true; })

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

  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclick();
  }

  clicking = false;
  private doclick() {
    if (!this.enabled || !this.visible) return;

    this.mesh.scale.addScalar(-0.05);
    this.line.scale.addScalar(-0.05);

    this.clicking = true;

    const timer = setTimeout(() => {
      this.mesh.scale.addScalar(0.05);
      this.line.scale.addScalar(0.05);

      this.pressed.next();

      clearTimeout(timer);
      this.clicking = false;
    }, 100);
  }

  isover = false;
  over() {
    if (this.clicking || this.isover || !this.enabled) return;
    this.line.visible = true;
    this.isover = true;
  }
  out() {
    if (!this.enabled) return;
    this.line.visible = false;
    this.isover = false;
  }

}
