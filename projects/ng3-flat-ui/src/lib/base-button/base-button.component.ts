import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-base-button',
  exportAs: 'flatUIBaseButton',
  templateUrl: './base-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIBaseButton extends NgtObjectProps<Mesh>  {
  @Input() text = '';

  private _width = 0.5;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    if (this.mesh)
      this.setButtonColor();
  }


  private _buttonmaterial!: Material
  @Input()
  get buttonmaterial(): Material {
    if (this._buttonmaterial) return this._buttonmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set buttonmaterial(newvalue: Material) {
    this._buttonmaterial = newvalue;
  }


  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
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

  @Input() selectable?: InteractiveObjects;

  @Input() geometry!: BufferGeometry;

  @Output() pressed = new EventEmitter<string>();

  @ContentChild('button') button?: TemplateRef<unknown>;

  protected outline!: BufferGeometry; // outline material

  private mesh!: Mesh; // button mesh

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
  }

  createButtonGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  setButtonColor() {
    if (this.enabled) {
      this.mesh.material = this.buttonmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry?.dispose();
    this.outline?.dispose();
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclick(); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;

    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });

    this.setButtonColor();
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

      this.pressed.next(this.text);

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
