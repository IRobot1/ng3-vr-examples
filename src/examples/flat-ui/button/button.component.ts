import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { THEME_CHANGE_EVENT, GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-button',
  exportAs: 'flatUIButton',
  templateUrl: './button.component.html',
})
export class FlatUIButton extends NgtObjectProps<Mesh> implements AfterViewInit {
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

  @Input() enabled = true;
  @Input() active = false;

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
    
  private _clickcolor?: string;
  @Input()
  get clickcolor(): string {
    if (this._clickcolor) return this._clickcolor;
    return GlobalFlatUITheme.ClickColor;
  }
  set clickcolor(newvalue: string) {
    this._clickcolor = newvalue;
  }

  private _labelcolor?: string;
  @Input()
  get labelcolor(): string {
    if (this._labelcolor) return this._labelcolor;
    return  GlobalFlatUITheme.ButtonLabelColor;
  }
  set labelcolor(newvalue: string) {
    this._labelcolor = newvalue;
  }

  @Input() opacity = 0.5;
  @Input() transparent = true;

  @Input() selectable?: InteractiveObjects;

  @Output() pressed = new EventEmitter<string>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  private mesh!: Mesh;

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, this.height, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: this.opacity, transparent: this.transparent });
    }

    if (this.active)
      this.over();
    else
      this.out();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.selectable?.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.buttoncolor);
    })
  }

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclick(); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }

  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclick();
  }

  clicking = false;
  private doclick() {
    if (!this.enabled || !this.visible) return;

    this.material.color.setStyle(this.clickcolor);
    this.clicking = true;

    const timer = setTimeout(() => {
      if (this.isover)
        this.material.color.setStyle(this.hovercolor);
      else
        this.material.color.setStyle(this.buttoncolor);

      this.pressed.emit(this.text);

      clearTimeout(timer);
      this.clicking = false;
    }, 100);
  }

  isover = false;
  over() {
    if (this.clicking || this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }
}
