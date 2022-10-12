
export class Controller {
  constructor(
    public object: any,
    public property: string,
    public classname: string,
    public min?: number | any | any[],
    public max?: number,
    public step?: number
  ) { }

  name(newvalue: string) { this.property = newvalue }
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
    console.warn(this.width, this.height)
  }

  add(object: any, property: string, min?: number | object | any[], max?: number, step?: number): Controller {
    let classname = ''
    if (Object(min) === min) {
      classname = 'options'
    }
    else {
      const initialValue = object[property];
      classname = typeof initialValue;
    }
    const controller = new Controller(object, property, classname, min, max, step);
    this.list.push(controller);
    return controller;
  }

  addFolder(title: string): FlatGUI {
    const gui = new FlatGUI({ parent: this, title, width: this.width*150, height: this.height*150 });
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
