import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { Group, Material, Mesh, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-expansion-panel',
  exportAs: 'flatUIExpansionPanel',
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIExpansionPanel extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _title = '';
  @Input()
  get title(): string { return this._title }
  set title(newvalue: string) {
    this._title = newvalue;
    this.displaytitle = this.title.substring(0, this.overflow * this.width);
  }

  @Input() overflow = 24;

  titleheight = 0.1;

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
    let height = this.titleheight;
    if (this.expanded) height += this._height;
    return height
  }

  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _expanded = true;
  @Input()
  get expanded(): boolean { return this._expanded }
  set expanded(newvalue: boolean) {
    this._expanded = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }

    // hide the group when expanding.  Visbable when layout called
    if (this.group && newvalue) {
      this.group.visible = false;
      const timer = setTimeout(() => {
        this.group.visible = true;
        clearTimeout(timer);
        this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
      }, 100)

    }

    if (this.panel) this.panel.scale.y = newvalue ? 1 : 0;
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

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  @Input() selectable?: InteractiveObjects;

  protected displaytitle!: string

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  protected group!: Group;
  protected panel!: Mesh;

  private mesh!: Object3D;

  protected meshready(mesh: Object3D) {
    this.selectable?.add(mesh);

    this.mesh = mesh;
  }
}
