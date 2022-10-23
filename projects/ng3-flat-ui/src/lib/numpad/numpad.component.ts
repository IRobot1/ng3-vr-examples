import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

import { BufferGeometry, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


class NumKeySetting {
  constructor(public position: NgtTriple, public numkey: string, public size = 0.1) { }
}

@Component({
  selector: 'flat-ui-numpad',
  exportAs: 'flatUINumpad',
  templateUrl: './numpad.component.html',
})
export class FlatUINumpad extends NgtObjectProps<Mesh> {
  @Input() text: string = ''

  @Input() selectable?: InteractiveObjects;

  private _popupcolor?: string;
  @Input()
  get popupcolor(): string {
    if (this._popupcolor) return this._popupcolor;
    return GlobalFlatUITheme.PopupColor;
  }
  set popupcolor(newvalue: string) {
    this._popupcolor = newvalue;
  }


  @Output() pressed = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() close = new EventEmitter<boolean>();

  @Input() geometry!: BufferGeometry;
  @Input() material!: MeshBasicMaterial;

  protected keys: Array<NumKeySetting> = [];

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createNumpadGeometry();
    if (!this.material) this.createNumpadMaterial();    
  }

  createNumpadGeometry() {
    const keyboardwidth = 0.40;
    const keyboardheight = 0.60;

    const flat = new Shape();
    roundedRect(flat, 0, 0, keyboardwidth, keyboardheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  createNumpadMaterial() {
    this.material = new MeshBasicMaterial({ color: this.popupcolor });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.popupcolor);
    })

    const top = ['7', '8', '9']
    const middle = ['4', '5', '6']
    const bottom = ['1', '2', '3']
    const last = ['-', '0', '.']

    const buttonwidth = 0.11
    const z = 0.001;
    const ytop = 0.22
    const ymiddle = 0.11
    const ybottom = 0
    const ylast = -0.11
    const yback = -0.22

    let width = (top.length - 1) * buttonwidth;
    top.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), ytop, z], numkey));
    })

    width = (middle.length - 1) * (buttonwidth + 0.01);
    middle.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), ymiddle, z], numkey));
    })

    width = (bottom.length - 1) * buttonwidth;
    bottom.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), ybottom, z], numkey));
    })

    width = (last.length - 1) * buttonwidth;
    last.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), ylast, z], numkey));
    })
    this.keys.push(new NumKeySetting([0, yback, z], 'Back', 0.3));

    this.selectable?.add(mesh);
    mesh.addEventListener('click', (e: any) => { e.stop = true; });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  protected missed() {
    this.close.next(true)
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    let keycode = event.key;
    if (event.key == 'Backspace')
      keycode = 'Back';

    const key = this.keys.find(x => x.numkey == keycode);
    if (key)
      this.clicked(keycode);
  }

  protected clicked(keycode: string) {
    if (!this.visible) return;

    this.pressed.emit(keycode);
    if (keycode == 'Back') {
      if (this.text.length > 0) {
        this.text = this.text.slice(0, this.text.length - 1);
        this.change.emit(this.text);
      }
    }
    else {
      this.text += keycode;
      this.change.emit(this.text);
    }
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
