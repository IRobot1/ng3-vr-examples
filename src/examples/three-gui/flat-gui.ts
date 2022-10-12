import { ListItem } from "../flat-ui/list/list.component";

export class Controller {
  title!: string;

  constructor(
    public object: any,
    public property: string,
    public classname: string,
    public min?: number | any | any[],
    public max?: number,
    public step?: number
  ) {
    this.title = property;
  }

  name(newvalue: string) { this.title = newvalue;  }
}

export class FlatGUI {
  list: Array<Controller> = [];

  parent?: FlatGUI;
  title = '';
  width = 150;
  height = 150;

  constructor({
    parent,
    title = 'Controls',
    width = 150,
    height = 150,
  }: {
    parent?: FlatGUI,
    title?: string,
    width?: number,
    height?: number,
  }) {
    this.parent = parent;
    this.title = title;
    this.width = width / 150;
    this.height = height / 150;
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
        list.push({ text: name, data: values[index] });
      });

      data = list
    }
    else {
      const initialValue = object[property];
      classname = typeof initialValue;
    }
    const controller = new Controller(object, property, classname, data, max, step);
    this.list.push(controller);
    return controller;
  }

  addFolder(title: string): FlatGUI {
    const gui = new FlatGUI({ parent: this, title, width: this.width * 150, height: this.height * 150 });
    const controller = new Controller(gui, title, 'folder');
    this.list.push(controller);
    return gui;
  }

  addColor(object: any, property: string): Controller {
    const controller = new Controller(object, property, 'color');
    this.list.push(controller);
    return controller;
  }
}
