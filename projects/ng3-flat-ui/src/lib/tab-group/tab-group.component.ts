import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Group, Material, Mesh } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { FlatUITab } from "../tab/tab.component";
import { GlobalFlatUITheme } from "../flat-ui-theme";
import { HEIGHT_CHANGED_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";


@Component({
  selector: 'flat-ui-tab-group',
  exportAs: 'flatUITabGroup',
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUITabGroup extends NgtObjectProps<Group> {
  private _label: any;
  @Input()
  get label(): any { return this._label }
  set label(newvalue: any) {
    this._label = newvalue;

    const tab = this.tabs.find(item => item.label == newvalue);
    if (tab) {
      this.selectTab(tab);
    }
  }

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    this.tabs.forEach(tab => tab.enabled = newvalue);
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
    return this.tabheight + this._height;
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

  protected mesh!: Mesh;

  tabs: Array<FlatUITab> = [];

  @Output() change = new EventEmitter<any>();

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private selected?: FlatUITab;

  protected tabheight = 0;

  private selectTab(newtab: FlatUITab) {
    if (this.selected)
      this.selected.active = false;

    this.tabheight = Math.max(this.tabheight, newtab.tabheight);
    newtab.active = true;
    this.change.next(newtab.label);

    // hide the panel when switching content.  Visible when layout called
    if (this.mesh) {
      this.mesh.visible = false;
      this.templateRef = newtab.templateRef;
      const timer = setTimeout(() => {
        this.mesh.visible = true;
        clearTimeout(timer);
      }, 100)
    }

    this.selected = newtab;
  }

  addtab(tab: FlatUITab) {
    const dup = this.tabs.find(item => item.label == tab.label);
    if (dup) console.warn('duplicate tab with label', tab.label);

    this.tabs.push(tab);
    tab.enabled = this.enabled;

    if (this.label == tab.label || tab.active) {
      this.selectTab(tab);
    }
  }

  removetab(tab: FlatUITab) {
    this.tabs = this.tabs.filter(item => item != tab);
  }
}
