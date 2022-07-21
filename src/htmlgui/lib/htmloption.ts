import { Controller } from "../../guibase";
import { HTMLController } from "./htmlcontroller";

export class HTMLOption extends HTMLController {
  private $select!: HTMLSelectElement;
  private $display!: HTMLDivElement;

  override build(): Controller {
    super.build();

    this.$select = document.createElement('select');
    this.$select.setAttribute('aria-labelledby', this.$name.id);

    this.$display = document.createElement('div');
    this.$display.classList.add('display');


    this.$select.addEventListener('change', () => {
      this.setValue(this.values[this.$select.selectedIndex]);
      this._callOnFinishChange();
    });

    this.$select.addEventListener('focus', () => {
      this.$display.classList.add('focus');
    });

    this.$select.addEventListener('blur', () => {
      this.$display.classList.remove('focus');
    });

    this.$widget.appendChild(this.$select);
    this.$widget.appendChild(this.$display);

    this.$disable = this.$select;

    this.updateDisplay();
    return this;
  }

  private _values: Array<any> = [];
  get values(): Array<any> { return this._values }

  private _names: Array<string> = [];
  get names(): Array<string> { return this._names }


  options(options: object | Array<any>): HTMLOption {
    this._values = Array.isArray(options) ? options : Object.values(options);
    this._names = Array.isArray(options) ? options : Object.keys(options);
    this.names.forEach(name => {
        const $option = document.createElement('option');
        $option.innerHTML = name;
        this.$select.appendChild($option);
    });
    return this;
  }


  override updateDisplay(): Controller {
    const value = this.getValue();
    const index = this.values.indexOf(value);
    this.$select.selectedIndex = index;
    this.$display.innerHTML = index === -1 ? value : this.names[index];
    return this;
  }


}
