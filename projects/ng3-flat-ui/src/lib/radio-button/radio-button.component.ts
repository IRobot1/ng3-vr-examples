import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { DoubleSide, Mesh, MeshBasicMaterial, Side } from "three";
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

  @Input() enabled = true;

  private _buttoncolor?: string;
  @Input()
  get buttoncolor(): string {
    if (this._buttoncolor) return this._buttoncolor;
    return GlobalFlatUITheme.ButtonColor;
  }
  set buttoncolor(newvalue: string) {
    this._buttoncolor = newvalue;
  }

  private _hovercolor?: string;
  @Input()
  get hovercolor(): string {
    if (this._hovercolor) return this._hovercolor;
    return GlobalFlatUITheme.HoverColor;
  }
  set hovercolor(newvalue: string) {
    this._hovercolor = newvalue;
  }
  private _truecolor?: string;
  @Input()
  get truecolor(): string {
    if (this._truecolor) return this._truecolor;
    return GlobalFlatUITheme.RadioTrueColor;
  }
  set truecolor(newvalue: string) {
    this._truecolor = newvalue;
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

  material!: MeshBasicMaterial;

  side: Side = DoubleSide;


  override preInit() {
    super.preInit();

    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: this.side, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.checkmesh);

    this.material.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.buttoncolor);
    })
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.mesh = mesh;
  }

  private checkmesh!: Mesh;

  checkmeshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.checkmesh = mesh;
  }

  clicked(event: NgtEvent<MouseEvent>) {
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible) return;

    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  isover = false;
  over() {
    if (this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }

  out() {
    if (!this.enabled) return;
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

}
