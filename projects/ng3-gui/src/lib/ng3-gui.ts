import { ListItem } from "ng3-flat-ui";

export class Controller {
  title!: string;
  _decimals: number;
  enabled = true;
  private initialValue: any;

  constructor(
    public parent: Ng3GUI,
    public object: any,
    public property: string,
    public classname: string,
    public _min?: number | any | any[],
    public _max?: number,
    public _step?: number
  ) {
    this.title = property;
    this._decimals = 0;
    this.initialValue = this.getValue();
  }

  getValue(): any { return this.object[this.property] }
  setValue(newvalue: any): Controller {
    if (this.object[this.property] != newvalue) {
      this.object[this.property] = newvalue
      this._callOnChange();
    }
    return this;
  }

  name(newvalue: string): Controller { this.title = newvalue; return this; }
  max(newvalue: number): Controller { this._max = newvalue; return this; }
  min(newvalue: number): Controller { this._min = newvalue; return this; }
  step(newvalue: number): Controller { this._step = newvalue; return this; }
  decimals(newvalue: number) { this._decimals = newvalue; return this; }

  listen(): Controller { return this; }

  disable(): Controller { this.enabled = false; return this; }
  enable(): Controller { this.enabled = true; return this; }
  reset(): Controller {
    this.setValue(this.initialValue);
    this._callOnFinishChange();
    return this;
  }

  public _changeCallback!: (event: any) => void;
  onChange(callback: (e: any) => void): Controller { this._changeCallback = callback; return this; }
  protected _callOnChange() {
    this.parent._callOnChange(this);

    if (this._changeCallback !== undefined) {
      this._changeCallback.call(this, this.getValue());
    }
    this._changed = true;
  }

  public _finishCallback!: (event: any) => void;
  onFinishChange(callback: (e: any) => void): Controller { this._finishCallback = callback; return this; }

  _changed = false;
  _callOnFinishChange() {

    if (this._changed) {

      this.parent._callOnFinishChange(this);

      if (this._finishCallback !== undefined) {
        this._finishCallback.call(this, this.getValue());
      }

    }
    this._changed = false;
  }

}

export class Ng3GUI {
  list: Array<Controller> = [];

  parent?: Ng3GUI;
  root!: Ng3GUI;
  title = '';
  width = 150;
  height = 150;

  constructor({
    parent,
    title = 'Controls',
    width = 150,
    height = 150,
  }: {
    parent?: Ng3GUI,
    title?: string,
    width?: number,
    height?: number,
  }) {
    this.parent = parent;
    this.title = title;
    this.width = width / 150;
    this.height = height / 150;
    this.root = parent ? parent.root : this;
  }

  add(object: any, property: string, min?: number | object | any[], max?: number, step?: number): Controller {
    let classname = ''
    let data: any = min;

    if (Object(min) === min) {
      classname = 'options';
      const values = Array.isArray(min) ? min : Object.values(min as []);
      const names = Array.isArray(min) ? min : Object.keys(min as []);

      const list: Array<ListItem> = [];
      names.forEach((name, index) => {
        list.push({ text: name.toString(), data: values[index] });
      });

      data = list
    }
    else {
      const initialValue = object[property];
      classname = typeof initialValue;
    }
    const controller = new Controller(this, object, property, classname, data, max, step);
    this.list.push(controller);
    return controller;
  }

  addFolder(title: string): Ng3GUI {
    const gui = new Ng3GUI({ parent: this, title, width: this.width * 150, height: this.height * 150 });
    const controller = new Controller(this, gui, title, 'folder');
    this.list.push(controller);
    return gui;
  }

  addColor(object: any, property: string, rgbScale = 1): Controller {
    const controller = new Controller(this, object, property, 'color');
    this.list.push(controller);
    return controller;
  }

  reset(recursive = true) {
    this.list.forEach(c => c.reset());
    return this;
  }
  settitle(newvalue: string): Ng3GUI { this.title = newvalue; return this; }

  expanded = true;
  open(): Ng3GUI { this.expanded = true; return this; }
  close(): Ng3GUI { this.expanded = false; return this; }

  public _changeCallback!: (event: any) => void;
  onChange(callback: (e: any) => void): Ng3GUI { this._changeCallback = callback; return this; }

  _callOnChange(controller: { object: any; property: any; getValue: () => any; }) {
    if (this.parent) {
      this.parent?._callOnChange(controller);
    }

    if (this._changeCallback !== undefined) {
      this._changeCallback.call(this, {
        object: controller.object,
        property: controller.property,
        value: controller.getValue(),
        controller
      });
    }
  }

  public _finishCallback!: (event: any) => void;
  onFinishChange(callback: (e: any) => void): Ng3GUI { this._finishCallback = callback; return this; }


  _changed = false;

  _callOnFinishChange(controller: Controller) {

    if (this._changed) {

      this.parent?._callOnFinishChange(controller);

      if (this._finishCallback !== undefined) {
        this._finishCallback.call(this, {
          object: controller.object,
          property: controller.property,
          value: controller.getValue(),
          controller
        });
      }

    }
    this._changed = false;
  }
}
