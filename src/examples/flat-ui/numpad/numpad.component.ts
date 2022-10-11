import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { ButtonColor, PanelColor, PopupColor, roundedRect } from "../flat-ui-utils";

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
  @Input() enabled = true;

  @Input() selectable?: InteractiveObjects;

  @Input() popupcolor = PopupColor;

  @Output() pressed = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() close = new EventEmitter<boolean>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  keys: Array<NumKeySetting> = [];

  override preInit() {
    super.preInit();

    const keyboardwidth = 0.40;
    const keyboardheight = 0.60;

    const flat = new Shape();
    roundedRect(flat, 0, 0, keyboardwidth, keyboardheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
    this.material = new MeshBasicMaterial({ color: this.popupcolor, side: DoubleSide });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
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
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  missed() {
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

  clicked(keycode: string) {
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

  ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
