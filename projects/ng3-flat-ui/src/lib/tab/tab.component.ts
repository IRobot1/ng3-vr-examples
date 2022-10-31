import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Group, Material, Mesh, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-tab',
  exportAs: 'flatUITab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUITab extends NgtObjectProps<Mesh> implements AfterViewInit {

  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    this._text = newvalue;
    this.displaytitle = this.text.substring(0, this.overflow * this.tabwidth);
  }

  @Input() overflow = 24;

  @Input() data: any;

  private _selected = false;
  @Input()
  get selected(): boolean { return this._selected }
  set selected(newvalue: boolean) {
    this._selected = newvalue;
    if (this.mesh) {
      this.mesh.visible = newvalue;
    }
    this.change.next(newvalue);
  }

  @Input() enabled = true;

  @Input() tabwidth = 0.5; // tab width
  @Input() tabheight = 0.15; // tab height

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

  // content panel width and height
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
  get height() {
    let height = this.tabheight;
    if (this.selected) height += this._height;
    return height
  }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _panelmaterial?: Material;
  @Input()
  get panelmaterial(): Material {
    if (this._panelmaterial) return this._panelmaterial;
    return GlobalFlatUITheme.PanelMaterial;
  }
  set panelmaterial(newvalue: Material) {
    this._panelmaterial = newvalue;
  }

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();


  protected displaytitle!: string

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.tabwidth;
      e.height = this.tabheight;
      e.updated = true;
    });
  }

  protected group!: Group;
  protected panel!: Mesh;

  private mesh!: Object3D;

  protected meshready(mesh: Object3D) {
    this.mesh = mesh;
  }

  pressed(event: any) {

  }
}
