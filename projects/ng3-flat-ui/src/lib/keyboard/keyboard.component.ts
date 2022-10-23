import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

import { BufferGeometry, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


class KeySetting {
  constructor(public position: NgtTriple, public lower: string,
    public upper?: string, public alpha?: string,
    public size = 0.1, public fontsize = 0.15) { }
}

type KeyCase = 'lower' | 'upper' | 'numbers';

@Component({
  selector: 'flat-ui-keyboard',
  exportAs: 'flatUIKeyboard',
  templateUrl: './keyboard.component.html',
})
export class FlatUIKeyboard extends NgtObjectProps<Mesh>  {
  @Input() text: string = ''
  @Input() enabled = true;
  @Input() allowenter = false;

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

  protected keys: Array<KeySetting> = [];

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createKeyboardGeometry();
    if (!this.material) this.createKeyboardMaterial();
  }

  createKeyboardGeometry() {
    const keyboardwidth = 1.8;
    const keyboardheight = 0.48;

    const flat = new Shape();
    roundedRect(flat, 0, 0, keyboardwidth, keyboardheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  createKeyboardMaterial() {
    this.material = new MeshBasicMaterial({ color: this.popupcolor });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  protected missed() {
    this.close.next(true);
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.popupcolor);
    })

    const top = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
    const topalpha = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    const middle = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
    const middlealpha = ['#', '$', '_', '&', '-', '+', '(', ')', '`']
    const bottom = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    const bottomalpha = ['*', '"', "'", '<', ';', '!', '~']

    const buttonwidth = 0.11
    const z = 0.001;
    const ytop = 0.17
    const ymiddle = 0.06
    const ybottom = -0.06
    const yspace = -0.17

    let width = (top.length - 1) * buttonwidth;
    top.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth), ytop, z], lower, lower.toUpperCase(), topalpha[index]));
    })

    width = (middle.length - 1) * (buttonwidth + 0.01);
    middle.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth), ymiddle, z], lower, lower.toUpperCase(), middlealpha[index]));
    })
    this.keys.push(new KeySetting([(-width / 2 + middle.length * buttonwidth + 0.15), ymiddle, z], 'Back', 'Back', 'Back', 0.4, 0.1));
    this.keys.push(new KeySetting([(-width / 2 - 0.21), ymiddle, z], 'ABC', 'abc', 'ABC', 0.3, 0.1));

    width = (bottom.length - 1) * buttonwidth;
    bottom.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth), ybottom, z], lower, lower.toUpperCase(), bottomalpha[index]));
    })
    if (this.allowenter) {
      this.keys.push(new KeySetting([(-width / 2 + bottom.length * buttonwidth + 0.16), ybottom, z], 'Enter', 'Enter', 'Enter', 0.4, 0.1));
    }
    this.keys.push(new KeySetting([-0.56, yspace, z], '123', '123', 'abc', 0.3, 0.1));
    this.keys.push(new KeySetting([0, yspace, z], ' ', ' ', ' ', 0.8));
    this.keys.push(new KeySetting([0.51, yspace, z], '.', ',', ':'));
    this.keys.push(new KeySetting([0.62, yspace, z], '@', '?', '/'));

    this.selectable?.add(mesh);
    mesh.addEventListener('click', (e: any) => { e.stop = true; });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    let keycode = event.key;
    if (event.key == 'Backspace')
      keycode = 'Back';
    else if (event.key == 'Shift') {
      if (this.keycase == 'lower') {
        keycode = 'ABC';
      } else if (this.keycase == 'upper') {
        keycode = '123';
      } else if (this.keycase == 'numbers') {
        keycode = 'abc';
      }
    }

    const key = this.keys.find(x => x.lower == keycode || x.upper == keycode || x.alpha == keycode);
    if (key)
      this.clicked(keycode);
  }

  @HostListener('document:keyup', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    let keycode = event.key;
    if (event.key == 'Shift') {
      if (this.keycase == 'lower') {
        keycode = 'ABC';
      } else if (this.keycase == 'upper') {
        keycode = 'abc';
      }
      this.clicked(keycode);
    }
  }

  private keycase: KeyCase = 'lower';

  protected keycode(keys: KeySetting): string {
    if (this.keycase == 'lower')
      return keys.lower;
    else if (this.keycase == 'upper')
      return keys.upper ? keys.upper : keys.lower;
    else
      return keys.alpha ? keys.alpha : keys.lower;
  }

  protected clicked(keycode: string) {
    if (!this.visible) return;


    if (keycode == 'ABC') {
      this.keycase = 'upper'
    } else if (keycode == 'abc') {
      this.keycase = 'lower';
    } else if (keycode == '123') {
      this.keycase = 'numbers'
    }
    else {
      this.pressed.emit(keycode);
      if (keycode == 'Enter' && this.allowenter) {
        this.change.emit(this.text);
        this.text = '';
      }
      else if (keycode == 'Back') {
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
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
