import { ThreeController } from "./threecontroller";

export class ThreeOption extends ThreeController {
  private _values: Array<any> = [];
  get values(): Array<any> { return this._values }

  private _names: Array<string> = [];
  get names(): Array<string> { return this._names }


  options(options: object | Array<any>): ThreeOption {
    this._values = Array.isArray(options) ? options : Object.values(options);
    this._names = Array.isArray(options) ? options : Object.keys(options);
    this.names.forEach(name => {
    //  const $option = document.createElement('option');
    //  $option.innerHTML = name;
    //  this.$select.appendChild($option);
    });
    return this;
  }


}
