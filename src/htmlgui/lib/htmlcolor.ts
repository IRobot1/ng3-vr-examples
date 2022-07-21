import { Controller } from "../../guibase";
import { HTMLController } from "./htmlcontroller";

let normalizeColorString = (value: string) => {

  let match, result;

  if (match = value.match(/(#|0x)?([a-f0-9]{6})/i)) {

    result = match[2];

  } else if (match = value.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) {

    result = parseInt(match[1]).toString(16).padStart(2, '0')
      + parseInt(match[2]).toString(16).padStart(2, '0')
      + parseInt(match[3]).toString(16).padStart(2, '0');

  } else if (match = value.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) {

    result = match[1] + match[1] + match[2] + match[2] + match[3] + match[3];

  }

  if (result) {
    return '#' + result;
  }

  return false;

}

const STRING = {
  isPrimitive: true,
  match: (v: any) => typeof v === 'string',
  fromHexString: normalizeColorString,
  toHexString: normalizeColorString,
};

const INT = {
  isPrimitive: true,
  match: (v: any) => typeof v === 'number',
  fromHexString: (value: string) => parseInt(value.substring(1), 16),
  toHexString: (value: number) => '#' + value.toString(16).padStart(6, '0')
};

const ARRAY = {
  isPrimitive: false,
  match: Array.isArray,

  fromHexString(value: string, target: Array<number>, rgbScale = 1) {

    const int = INT.fromHexString(value);

    target[0] = (int >> 16 & 255) / 255 * rgbScale;
    target[1] = (int >> 8 & 255) / 255 * rgbScale;
    target[2] = (int & 255) / 255 * rgbScale;

  },
  toHexString(v: { r: number, g: number, b: number }, rgbScale = 1) {

    rgbScale = 255 / rgbScale;

    const int = (v.r * rgbScale) << 16 ^
      (v.g * rgbScale) << 8 ^
      (v.b * rgbScale) << 0;

    return INT.toHexString(int);

  }
};

const OBJECT = {
  isPrimitive: false,
  match: (v: any) => Object(v) === v,
  fromHexString(string: string, target: any, rgbScale = 1) {

    const int = INT.fromHexString(string);

    target.r = (int >> 16 & 255) / 255 * rgbScale;
    target.g = (int >> 8 & 255) / 255 * rgbScale;
    target.b = (int & 255) / 255 * rgbScale;

  },
  toHexString(v: { r: number, g: number, b: number }, rgbScale = 1) {

    rgbScale = 255 / rgbScale;

    const int = (v.r * rgbScale) << 16 ^
      (v.g * rgbScale) << 8 ^
      (v.b * rgbScale) << 0;

    return INT.toHexString(int);

  }
};

const FORMATS = [STRING, INT, ARRAY, OBJECT];

export class HTMLColor extends HTMLController {
  private _initialValueHexString: any;
  private _format: any;
  private _textFocused = false;
  private _rgbScale = 1;

  private $input!: HTMLInputElement;
  private $text!: HTMLInputElement;
  private $display!: HTMLDivElement;

  override build(): Controller {
    super.build();

    this.$input = document.createElement('input');
    this.$input.setAttribute('type', 'color');
    this.$input.setAttribute('tabindex', '-1');
    this.$input.setAttribute('aria-labelledby', this.$name.id);

    this.$text = document.createElement('input');
    this.$text.setAttribute('type', 'text');
    this.$text.setAttribute('spellcheck', 'false');
    this.$text.setAttribute('aria-labelledby', this.$name.id);

    this.$display = document.createElement('div');
    this.$display.classList.add('display');

    this.$display.appendChild(this.$input);
    this.$widget.appendChild(this.$display);
    this.$widget.appendChild(this.$text);

    this._format = this.getColorFormat(this.initialValue);

    this._initialValueHexString = this.save();

    this.$input.addEventListener('input', () => {
      this._setValueFromHexString(this.$input.value);
    });

    this.$input.addEventListener('blur', () => {
      this._callOnFinishChange();
    });

    this.$text.addEventListener('input', () => {
      const tryParse = normalizeColorString(this.$text.value);
      if (tryParse) {
        this._setValueFromHexString(tryParse);
      }
    });

    this.$text.addEventListener('focus', () => {
      this._textFocused = true;
      this.$text.select();
    });

    this.$text.addEventListener('blur', () => {
      this._textFocused = false;
      this.updateDisplay();
      this._callOnFinishChange();
    });

    this.$disable = this.$text;

    this.updateDisplay();
    return this;

  }

  getColorFormat(value: string) {
    return FORMATS.find(format => format.match(value));
  }

  rgbScale(value: number): HTMLColor {
    this._rgbScale = value;
    return this;
  }

  override reset(): Controller {
    this._setValueFromHexString(this._initialValueHexString);
    return this;
  }

  _setValueFromHexString(value: string) {

    if (this._format.isPrimitive) {

      const newValue = this._format.fromHexString(value);
      this.setValue(newValue);

    } else {

      this._format.fromHexString(value, this.getValue(), this._rgbScale);
      this._callOnChange();
      this.updateDisplay();

    }

  }

  override save(): any {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }

  override load(value: string): Controller {
    this._setValueFromHexString(value);
    this._callOnFinishChange();
    return this;
  }

  override updateDisplay(): Controller {
    this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale);
    if (!this._textFocused) {
      this.$text.value = this.$input.value.substring(1);
    }
    this.$display.style.backgroundColor = this.$input.value;
    return this;
  }

}
