import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output } from "@angular/core";

import { Material, Mesh } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { FlatUIRadioGroup } from "../radio-group/radio-group.component";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtCircleGeometry, NgtRingGeometry } from "@angular-three/core/geometries";

@Component({
  selector: 'flat-ui-radio-button',
  exportAs: 'flatUIRadioButton',
  templateUrl: './radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtMesh,
    NgtRingGeometry,
    NgtCircleGeometry,
  ]
})
export class FlatUIRadioButton extends NgtObjectProps<Mesh> implements AfterViewInit {
  @Input() value: any;

  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;
    if (this.checkmesh)
      this.checkmesh.visible = newvalue;
    this.change.next(newvalue);
  }


  @Input() segments = 32;


  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    this.setBackgroundColor();
  }

  private _backgroundmaterial!: Material
  @Input()
  get backgroundmaterial(): Material {
    if (this._backgroundmaterial) return this._backgroundmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set backgroundmaterial(newvalue: Material) {
    this._backgroundmaterial = newvalue;
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

  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
  }

  private _radiomaterial!: Material
  @Input()
  get radiomaterial(): Material {
    if (this._radiomaterial) return this._radiomaterial;
    return GlobalFlatUITheme.CheckMaterial;
  }
  set radiomaterial(newvalue: Material) {
    this._radiomaterial = newvalue;
  }


  private _width = 0.1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.checkmesh) {
      this.checkmesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
      this.checkmesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  setBackgroundColor() {
    if (!this.mesh) return;

    if (this.enabled) {
      this.mesh.material = this.backgroundmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }

  constructor(
    @Optional() private radiogroup?: FlatUIRadioGroup
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    // add if part of a group
    this.radiogroup?.addbutton(this);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.checkmesh);

    this.radiogroup?.removebutton(this);
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.mesh = mesh;
    this.setBackgroundColor();
  }

  private checkmesh!: Mesh;

  protected checkmeshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.checkmesh = mesh;
    this.checkmesh.visible = this.checked;
  }

  protected clicked(event: NgtEvent<MouseEvent>) {
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible || this.checked) return;

    this.checked = true;
    if (this.radiogroup)
      this.radiogroup.value = this.value;
  }

  private isover = false;
  protected over() {
    if (this.isover || !this.enabled) return;
    this.mesh.material = this.outlinematerial;
    this.isover = true;
  }

  protected out() {
    if (!this.enabled) return;
    this.mesh.material = this.backgroundmaterial;
    this.isover = false;
  }

}
