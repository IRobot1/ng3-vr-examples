import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { Material, Mesh, MeshBasicMaterial } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-radio-button',
  exportAs: 'flatUIRadioButton',
  templateUrl: './radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIRadioButton extends NgtObjectProps<Mesh> implements AfterViewInit {
  @Input() checked = false;
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

  private _checkmaterial!: Material
  @Input()
  get checkmaterial(): Material {
    if (this._checkmaterial) return this._checkmaterial;
    return GlobalFlatUITheme.CheckMaterial;
  }
  set checkmaterial(newvalue: Material) {
    this._checkmaterial = newvalue;
  }

  setBackgroundColor() {
    if (!this.mesh) return;

    if (this.enabled) {
      this.mesh.material = this.backgroundmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }


  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.checkmesh);
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
  }

  protected clicked(event: NgtEvent<MouseEvent>) {
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible) return;

    this.checked = !this.checked;
    this.change.next(this.checked);
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
