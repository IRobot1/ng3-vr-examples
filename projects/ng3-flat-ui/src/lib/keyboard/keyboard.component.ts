import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgFor } from "@angular/common";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { FlatUIBaseButton } from "../base-button/base-button.component";
import { FlatUIMaterialIcon } from "../material-icon/material-icon.component";


class KeySetting {
  constructor(public position: NgtTriple, public lower: string,
    public upper?: string, public alpha?: string,
    public size = 0.1, public fontsize = 0.15) { }
}

type KeyCase = 'lower' | 'upper' | 'numbers';

class IconSetting {
  constructor(public position: NgtTriple, public icon: string, public keycode: string) { }
}

@Component({
  selector: 'flat-ui-keyboard',
  exportAs: 'flatUIKeyboard',
  templateUrl: './keyboard.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgtGroup,
    NgtMesh,
    NgtSobaText,
    FlatUIBaseButton,
    FlatUIMaterialIcon,
  ]
})
export class FlatUIKeyboard extends NgtObjectProps<Mesh>  {
  @Input() text: string = ''
  @Input() allowenter = false;

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

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  @Output() pressed = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  @Input() geometry!: BufferGeometry;

  protected keys: Array<KeySetting> = [];
  protected icons: Array<IconSetting> = [];

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createKeyboardGeometry();
  }

  private keyboardwidth = 1.9;
  private keyboardheight = 0.48;

  createKeyboardGeometry() {

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.keyboardwidth, this.keyboardheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
  }

  protected missed() {
    this.close.next();
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {

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
    const ybottom = -0.05
    const yspace = -0.16

    let width = (top.length - 1) * buttonwidth;
    top.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth), ytop, z], lower, lower.toUpperCase(), topalpha[index]));
    })
    this.icons.push(new IconSetting([(width / 2 + 0.35), 0.16, z], 'content_copy', 'ctrl+c'));
    this.icons.push(new IconSetting([(width / 2 + 0.35), 0, z], 'content_cut', 'ctrl+x'));
    this.icons.push(new IconSetting([(width / 2 + 0.35), -0.16, z], 'content_paste', 'ctrl+v'));

    width = (middle.length - 1) * (buttonwidth + 0.01);
    middle.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth + 0.12), ymiddle, z], lower, lower.toUpperCase(), middlealpha[index]));
    })
    this.icons.push(new IconSetting([(-width / 2 + middle.length * buttonwidth + 0.15), ymiddle, z], 'backspace', 'Backspace'));
    this.keys.push(new KeySetting([(-width / 2 - 0.09), ymiddle, z], 'ABC', 'abc', 'ABC', 0.3, 0.1));

    width = (bottom.length - 1) * buttonwidth;
    bottom.forEach((lower, index) => {
      this.keys.push(new KeySetting([(-width / 2 + index * buttonwidth), ybottom, z], lower, lower.toUpperCase(), bottomalpha[index]));
    })
    if (this.allowenter) {
      this.icons.push(new IconSetting([(-width / 2 + bottom.length * buttonwidth + 0.05), ybottom, z], 'keyboard_return', 'Enter'));
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
    if (event.key == 'Backspace' || event.key == 'Enter')
      this.clicked(event.key);
    else if (event.key == 'Shift') {
      if (this.keycase == 'lower') {
        keycode = 'ABC';
      } else if (this.keycase == 'upper') {
        keycode = '123';
      } else if (this.keycase == 'numbers') {
        keycode = 'abc';
      }
    }
    if (event.ctrlKey) {
      const key = event.key.toLowerCase();
      if (key == 'v' || key == 'c' || key == 'x') {
        this.clicked("ctrl+" + key);
      }
    }
    else {
      const key = this.keys.find(x => x.lower == keycode || x.upper == keycode || x.alpha == keycode);
      if (key)
        this.clicked(keycode);
    }
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

  protected iconcode(icons: IconSetting): string {
    return icons.keycode;
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
    else if (keycode == 'ctrl+v') {
      navigator.clipboard.readText().then(text => {
        this.text += text;
        this.change.next(this.text);
      });
    }
    else if (keycode == 'ctrl+c' || keycode == 'ctrl+x') {
      navigator.clipboard.writeText(this.text).then(() => {
        console.log(this.text, 'saved to clipboard');
        if (keycode == 'ctrl+x') {
          this.text = '';
          this.change.next(this.text);
        }
      });
    }
    else {
      this.pressed.next(keycode);
      if (keycode == 'Enter') {
        if (this.allowenter) {
          this.change.next(this.text);
          this.text = '';
        }
      }
      else if (keycode == 'Backspace') {
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
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
