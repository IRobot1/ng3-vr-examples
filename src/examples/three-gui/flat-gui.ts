
export class Controller {
  constructor(
    public object: any,
    public property: string,
    public classname: string,
    public min?: number | any | any[],
    public max?: number,
    public step?: number
  ) { }
}
export class FlatGUI {
  list: Array<Controller> = [];

  parent?: FlatGUI;
  title = '';
  width = 1;

  constructor({
    parent,
    title = 'Controls',
    width = 1,
  }: {
    parent?: FlatGUI,
    title?: string,
    width: number,
  }) {
    this.parent = parent;
    this.title = title;
    this.width = width / 150;
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

  //addFolder(title: string): FlatGUI {
  //  const gui = new FlatGUI({ parent: this, title, width: this.width });
  //  return gui;
  //}

}
