import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

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

  private _popupmaterial!: Material
  @Input()
  get popupmaterial(): Material {
    if (this._popupmaterial) return this._popupmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set popupmaterial(newvalue: Material) {
    this._popupmaterial = newvalue;
  }

  @Output() pressed = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  @Input() geometry!: BufferGeometry;

  protected keys: Array<NumKeySetting> = [];

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createNumpadGeometry();
  }

  createNumpadGeometry() {
    const numpadwidth = 0.50;
    const numpadheight = 0.50;

    const flat = new Shape();
    roundedRect(flat, 0, 0, numpadwidth, numpadheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    const top = ['7', '8', '9', '-']
    const middle = ['4', '5', '6', '']
    const bottom = ['1', '2', '3', '']
    const last = [',', '0', '.', '<-']

    const buttonwidth = 0.12
    const z = 0.001;
    const ytop = 0.18
    const ymiddle = 0.06
    const ybottom = -0.06
    const ylast = -0.18

    let width = (top.length - 1) * buttonwidth;
    top.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), ytop, z], numkey));
    })

    width = (middle.length - 1) * buttonwidth;
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

    this.selectable?.add(mesh);
    mesh.addEventListener('click', (e: any) => { e.stop = true; });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  protected missed() {
    this.close.next()
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    let keycode = event.key;
    if (event.key == 'Backspace')
      keycode = '<-';

    const key = this.keys.find(x => x.numkey == keycode);
    if (key)
      this.clicked(keycode);
  }

  protected clicked(keycode: string) {
    if (!this.visible) return;

    this.pressed.next(keycode);
    if (keycode == '<-') {
      if (this.text.length > 0) {
        this.text = this.text.slice(0, this.text.length - 1);
        this.change.next(this.text);
      }
    }
    else {
      this.text += keycode;
      this.change.next(this.text);
    }
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
