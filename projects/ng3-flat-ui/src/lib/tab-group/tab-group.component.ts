import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Group, Material, Mesh } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { FlatUITab } from "../tab/tab.component";

import { GlobalFlatUITheme } from "../flat-ui-theme";
import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { InteractiveObjects } from "../interactive-objects";


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

  @Input() enabled = true;

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

  @Input() tabheight = 0.15;

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<any>();

  protected mesh!: Mesh;

  tabs: Array<FlatUITab> = [];


  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private selected?: FlatUITab;

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = Math.max(this.xoffset, this.width);
      e.height = this.tabheight + this.height;
      e.updated = true;
    });
  }

  private selectTab(newtab: FlatUITab) {
    if (this.selected)
      this.selected.active = false;

    newtab.active = true;
    this.change.next(newtab.label);

    // hide the panel when switching content.  Visible when layout called
    if (this.mesh) {
      this.mesh.userData['layout'] = true;  // hint to still layout even though invisible
      this.mesh.visible = false;
      this.templateRef = newtab.templateRef;
      const timer = setTimeout(() => {
        this.mesh.visible = true;
        this.mesh.userData['layout'] = false;
        clearTimeout(timer);
      }, 100)
    }

    this.selected = newtab;
  }

  private xoffset = 0;

  addtab(tab: FlatUITab) {
    const dup = this.tabs.find(item => item.label == tab.label);
    if (dup) console.warn('duplicate tab with label', tab.label);

    this.tabs.push(tab);

    // offset center of first tab
    if (this.xoffset == 0) {
      this.xoffset = -this.width / 2;
    }
    this.xoffset += tab.tabwidth / 2
    tab.position.x = this.xoffset;
    tab.position.y = this.height / 2;
    this.xoffset += (tab.tabwidth / 2 + 0.01); // add small space between tabs

    if (this.label == tab.label || tab.active) {
      this.selectTab(tab);
    }
  }

  removetab(tab: FlatUITab) {
    this.tabs = this.tabs.filter(item => item != tab);
  }
}
