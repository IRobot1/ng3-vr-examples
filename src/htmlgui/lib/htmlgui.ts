import { Controller, GUIBase, GUIFactory } from "../../guibase";

import { HTMLBoolean } from "./htmlboolean";
import { HTMLButton } from "./htmlbutton";
import { HTMLColor } from "./htmlcolor";
import { HTMLController } from "./htmlcontroller";
import { HTMLNumber } from "./htmlnumber";
import { HTMLOption } from "./htmloption";
import { HTMLString } from "./htmlstring";

let stylesInjected = false;

let _injectStyles = (cssContent: string) => {
  const injected = document.createElement('style');
  injected.innerHTML = cssContent;
  const before = document.querySelector('head link[rel=stylesheet], head style');
  if (before) {
    document.head.insertBefore(injected, before);
  } else {
    document.head.appendChild(injected);
  }
}

export class HTMLGUI extends GUIBase {
  private static _init = false;

  public domElement: HTMLDivElement;
  private $title: HTMLDivElement;

  public $children: any;

  constructor({
    parent,
    autoPlace = parent === undefined,
    container,
    width = 100,
    title = 'Controls',
    injectStyles = true,
    touchStyles = true
  }: {
    parent?: GUIBase,
    autoPlace? : boolean
    container?: any,
    width? : number,
    title? : string,
    injectStyles? : boolean,
    touchStyles? : boolean
  }) {
    super(parent, title);

    if (!HTMLGUI._init) {
      GUIFactory.register('options', () => { return new HTMLOption() });
      GUIFactory.register('number', () => { return new HTMLNumber() });
      GUIFactory.register('boolean', () => { return new HTMLBoolean() });
      GUIFactory.register('string', () => { return new HTMLString() });
      GUIFactory.register('function', () => { return new HTMLButton() });
      GUIFactory.register('color', () => { return new HTMLColor() });
      HTMLGUI._init = true;
    }

    /**
     * The outermost container element.
     * @type {HTMLElement}
     */
    this.domElement = document.createElement('div');
    this.domElement.classList.add('lil-gui');

    /**
     * The DOM element that contains the title.
     * @type {HTMLElement}
     */
    this.$title = document.createElement('div');
    this.$title.classList.add('title');
    this.$title.setAttribute('role', 'button');
    this.$title.setAttribute('aria-expanded', 'true');
    this.$title.setAttribute('tabindex', '0');

    this.$title.addEventListener('click', () => this.openAnimated(this.closed));
    this.$title.addEventListener('keydown', (e: any) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        this.$title.click();
      }
    });

    // enables :active pseudo class on mobile
    this.$title.addEventListener('touchstart', () => { }, { passive: true });

    /**
     * The DOM element that contains children.
     * @type {HTMLElement}
     */
    this.$children = document.createElement('div');
    this.$children.classList.add('children');


    this.domElement.appendChild(this.$title);
    this.domElement.appendChild(this.$children);

    this.settitle(title);

    if (touchStyles) {
      this.domElement.classList.add('allow-touch-styles');
    }

    if (this.parent) {

      this.parent.children.push(this);
      this.parent.folders.push(this);

      (<HTMLGUI>this.parent).$children.appendChild(this.domElement);

      // Stop the constructor early, everything onward only applies to root GUI's
      return;

    }

    this.domElement.classList.add('root');

    // Inject stylesheet if we haven't done that yet
    if (!stylesInjected && injectStyles) {
      //_injectStyles(stylesheet);
      stylesInjected = true;
    }

    if (container) {

      container.appendChild(this.domElement);

    } else if (autoPlace) {

      this.domElement.classList.add('autoPlace');
      document.body.appendChild(this.domElement);

    }

    if (width) {
      this.domElement.style.setProperty('--width', width + 'px');
    }

    // Don't fire global key events while typing in the GUI:
    this.domElement.addEventListener('keydown', e => e.stopPropagation());
    this.domElement.addEventListener('keyup', e => e.stopPropagation());
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
      const className = 'options'
      const oc = <HTMLOption>(<HTMLOption>GUIFactory.create(className)).initialize(this, object, property, className).build();
      oc.options($1);
      return oc;
    }
    else {
      const initialValue = object[property];
      const className = typeof initialValue;
      switch (className) {

        case 'number':
          const nc = <HTMLNumber>(<HTMLNumber>GUIFactory.create(className)).initialize(this, object, property, className).build();
          nc.setmin($1).setmax(max).setstep(step);
          return nc;

        case 'boolean':
          return (<HTMLBoolean>GUIFactory.create(className)).initialize(this, object, property, className).build();

        default:
        case 'string':
          return (<HTMLString>GUIFactory.create(className)).initialize(this, object, property, className).build();

        case 'function':
          return (<HTMLButton>GUIFactory.create(className)).initialize(this, object, property, className).build();
      }
    }
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
    const className = 'color';
    const cc = <HTMLColor>(<HTMLColor>GUIFactory.create(className)) .initialize(this, object, property, className).build();
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
 * @returns {GUIBase}
 */
  addFolder(title: string): GUIBase {
    return new HTMLGUI({ parent: this, title });
  }

  addCustom(type: string, object: any, property: string): Controller {
    return (<HTMLController>GUIFactory.create(type)).initialize(this, object, property, type).build();
  }


  override settitle(title: string): GUIBase {
    super.settitle(title);
    this.$title.innerHTML = title;
    return this;
  }

  override openAnimated(open = true) {
    super.openAnimated(open);

    this.$title.setAttribute('aria-expanded', String(!this.closed));

    // wait for next frame to measure $children
    requestAnimationFrame(() => {

      // explicitly set initial height for transition
      const initialHeight = this.$children.clientHeight;
      this.$children.style.height = initialHeight + 'px';

      this.domElement.classList.add('transition');

      const onTransitionEnd = (e: any) => {
        if (e.target !== this.$children) return;
        this.$children.style.height = '';
        this.domElement.classList.remove('transition');
        this.$children.removeEventListener('transitionend', onTransitionEnd);
      };

      this.$children.addEventListener('transitionend', onTransitionEnd);

      // todo: this is wrong if children's scrollHeight makes for a gui taller than maxHeight
      const targetHeight = !open ? 0 : this.$children.scrollHeight;

      this.domElement.classList.toggle('closed', !open);

      requestAnimationFrame(() => {
        this.$children.style.height = targetHeight + 'px';
      });
    });

    return this;

  }
}
