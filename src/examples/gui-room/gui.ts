import { BooleanController } from "./boolean-controller";
import ColorController from "./color-controller";
import { Controller } from "./controller";
import { FunctionController } from "./function-controller";
import NumberController from "./number-controller";
import { OptionController } from "./option-controller";
import { StringController } from "./string-controller";

export class GUIFactory {

  private static controllers = new Map<string, () => Controller>([])
    .set('options', (): Controller => { return new OptionController() })
    .set('number', () => { return new NumberController() })
    .set('boolean', () => { return new BooleanController() })
    .set('string', () => { return new StringController() })
    .set('function', () => { return new FunctionController() })
    .set('color', () => { return new ColorController() })


  static create(type: string): Controller {
    return this.controllers.get(type)!();
  }

  static register(type: string, create: () => Controller) {
    this.controllers.set(type, create);
  }
}


export class GUI {

  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {HTMLElement} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   *
   */

  public children: Array<GUI | Controller> = [];
  public controllers: Array<Controller> = [];
  public folders: Array<GUI> = [];

  private root: GUI;
  private _closed = false;
  private _hidden = false;

  constructor(private parent?: GUI, public title = 'Controls') {
    this.root = parent ? parent.root : this;

    if (this.parent) {

      this.parent.children.push(this);
      this.parent.folders.push(this);

    }

  }


  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(object: any, property: string, $1?: any, max = 1, step?: number): Controller {

    if (Object($1) === $1) {
      const oc = <OptionController>GUIFactory.create('options').register(this, object, property);
      oc.options($1);
      return oc;
    }
    else {
      const initialValue = object[property];

      switch (typeof initialValue) {

        case 'number':
          const nc = <NumberController>GUIFactory.create('number').register(this, object, property);
          nc.min($1).max(max).step(step);
          return nc;

        case 'boolean':
          return GUIFactory.create('boolean').register(this, object, property);

        default:
        case 'string':
          return GUIFactory.create('string').register(this, object, property);

        case 'function':
          return GUIFactory.create('function').register(this, object, property);
      }
    }
  }

  addCustom(type: string, object: any, property: string): Controller {
    return GUIFactory.create(type).register(this, object, property)
  }

  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(object: any, property: string, rgbScale = 1) {
    const cc = <ColorController>GUIFactory.create('color')
      .register(this, object, property);

    cc.rgbScale(rgbScale);
    return cc;
  }

  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(title: string) {
    return new GUI(this, title);
  }

  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(obj: any, recursive = true) {

    if (obj.controllers) {

      this.controllers.forEach(c => {

        //if (c instanceof FunctionController) return;

        //if (c._name in obj.controllers) {
        //  c.load(obj.controllers[c._name]);
        //}

      });

    }

    if (recursive && obj.folders) {

      this.folders.forEach(f => {

        if (f.title in obj.folders) {
          f.load(obj.folders[f.title]);
        }

      });

    }

    return this;

  }

  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(recursive = true) {

    const obj: any = {
      controllers: {},
      folders: {}
    };

    this.controllers.forEach(c => {

      //if (c instanceof FunctionController) return;

      //if (c._name in obj.controllers) {
      //  throw new Error(`Cannot save GUI with duplicate property "${c._name}"`);
      //}

      //obj.controllers[c._name] = c.save();

    });

    if (recursive) {

      this.folders.forEach(f => {

        if (f.title in obj.folders) {
          throw new Error(`Cannot save GUI with duplicate folder "${f.title}"`);
        }

        obj.folders[f.title] = f.save();

      });

    }

    return obj;

  }

  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(open = true) {

    this._closed = !open;

    //this.$title.setAttribute('aria-expanded', !this._closed);
    //this.domElement.classList.toggle('closed', this._closed);

    return this;

  }

  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(false);
  }

  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(show = true) {

    this._hidden = !show;

    //this.domElement.style.display = this._hidden ? 'none' : '';

    return this;

  }

  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(false);
  }

  openAnimated(open = true) {

    // set state immediately
    this._closed = !open;

    //this.$title.setAttribute('aria-expanded', !this._closed);

    // wait for next frame to measure $children
    requestAnimationFrame(() => {

      //// explicitly set initial height for transition
      //const initialHeight = this.$children.clientHeight;
      ////this.$children.style.height = initialHeight + 'px';

      //this.domElement.classList.add('transition');

      //const onTransitionEnd = e => {
      //  if (e.target !== this.$children) return;
      //  this.$children.style.height = '';
      //  this.domElement.classList.remove('transition');
      //  this.$children.removeEventListener('transitionend', onTransitionEnd);
      //};

      //this.$children.addEventListener('transitionend', onTransitionEnd);

      //// todo: this is wrong if children's scrollHeight makes for a gui taller than maxHeight
      //const targetHeight = !open ? 0 : this.$children.scrollHeight;

      //this.domElement.classList.toggle('closed', !open);

      //requestAnimationFrame(() => {
      //  this.$children.style.height = targetHeight + 'px';
      //});

    });

    return this;

  }


  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(recursive = true) {
    const controllers = recursive ? this.controllersRecursive() : this.controllers;
    controllers.forEach(c => c.reset());
    return this;
  }

  public _onChange!: (event: any) => void;
  private _onFinishChange!: (value: any) => void;

  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(callback: (value: any) => void) {
    /**
     * Used to access the function bound to `onChange` events. Don't modify this value
     * directly. Use the `gui.onChange( callback )` method instead.
     * @type {Function}
     */
    this._onChange = callback;
    return this;
  }

  _callOnChange(controller: { object: any; property: any; getValue: () => any; }) {

    if (this.parent) {
      this.parent._callOnChange(controller);
    }

    if (this._onChange !== undefined) {
      this._onChange.call(this, {
        object: controller.object,
        property: controller.property,
        value: controller.getValue(),
        controller
      });
    }
  }

  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(callback: { (event: any): void; }) {
    /**
     * Used to access the function bound to `onFinishChange` events. Don't modify this value
     * directly. Use the `gui.onFinishChange( callback )` method instead.
     * @type {Function}
     */
    this._onFinishChange = callback;
    return this;
  }

  _callOnFinishChange(controller: Controller) {

    if (this.parent) {
      this.parent._callOnFinishChange(controller);
    }

    if (this._onFinishChange !== undefined) {
      this._onFinishChange.call(this, {
        object: controller.object,
        property: controller.property,
        value: controller.getValue(),
        controller
      });
    }
  }

  /**
   * Destroys all DOM elements and event listeners associated with this GUI
   */
  destroy() {

    if (this.parent) {
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent.folders.splice(this.parent.folders.indexOf(this), 1);
    }

    //if (this.domElement.parentElement) {
    //  this.domElement.parentElement.removeChild(this.domElement);
    //}

    Array.from(this.children).forEach(c => c.destroy());

  }

  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let controllers = Array.from(this.controllers);
    this.folders.forEach(f => {
      controllers = controllers.concat(f.controllersRecursive());
    });
    return controllers;
  }

  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let folders = Array.from(this.folders);
    this.folders.forEach(f => {
      folders = folders.concat(f.foldersRecursive());
    });
    return folders;
  }

}
