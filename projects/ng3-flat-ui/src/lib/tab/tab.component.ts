import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Optional, Output, TemplateRef } from "@angular/core";

import { Group, Material, Mesh, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { FlatUITabGroup } from "../tab-group/tab-group.component";


@Component({
  selector: 'flat-ui-tab',
  exportAs: 'flatUITab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUITab extends NgtObjectProps<Mesh> {
  @Input() label: string = 'tab'

  private _text! : string;
  @Input()
  get text(): string  {
    if (this._text) return this._text;
    return this.label;
  }
  set text(newvalue: string ) {
    this._text = newvalue;

    let text = this.label;
    if (newvalue) text = newvalue;
    
    this.displaytitle = text.substring(0, this.overflow * this.tabwidth);
  }

  @Input() overflow = 24;


  private _active = false;
  @Input()
  get active(): boolean { return this._active }
  set active(newvalue: boolean) {
    this._active = newvalue;

    if (this.mesh) {
      this.mesh.visible = newvalue;
    }
    this.change.next(newvalue);
  }

  @Input() enabled = true;

  @Input() tabwidth = 0.5; // tab width

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

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  private _listselectmaterial!: Material
  @Input()
  get listselectmaterial(): Material {
    if (this._listselectmaterial) return this._listselectmaterial;
    return GlobalFlatUITheme.ListSelectMaterial;
  }
  set listselectmaterial(newvalue: Material) {
    this._listselectmaterial = newvalue;
  }


  @Output() change = new EventEmitter<boolean>();


  protected displaytitle!: string

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  constructor(
    @Optional() private tabgroup?: FlatUITabGroup
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    // add if part of a group
    this.tabgroup?.addtab(this);

  }
  override ngOnDestroy() {
    super.ngOnDestroy();

    this.tabgroup?.removetab(this);
  }

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.mesh = mesh;
    this.mesh.visible = this.active;
  }

  pressed() {
    if (!this.enabled || !this.visible || this.active) return;

    this.active = true;
    if (this.tabgroup)
      this.tabgroup.label = this.label;
  }
}
