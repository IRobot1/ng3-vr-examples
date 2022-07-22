import { Group, Material, Mesh, MeshBasicMaterial, Object3D } from "three";
import { Font, TextGeometry } from "three-stdlib";

import { Controller, GUIBase, GUIFactory } from "../../guibase";

import { ThreeBoolean } from "./threeboolean";
import { ThreeButton } from "./threebutton";
import { ThreeColor } from "./threecolor";
import { ThreeController } from "./threecontroller";
import { ThreeNumber } from "./threenumber";
import { ThreeOption } from "./threeoption";
import { ThreeString } from "./threestring";

export class ThreeGUI extends GUIBase {
  private static default_titlematerial = new MeshBasicMaterial();
  private static default_uimaterial = new MeshBasicMaterial({ color: 0x171717 });
  private static default_accentmaterial = new MeshBasicMaterial({ color: 0x6495ED });

  private static _init = false;
  static position = 0;  // vertical position
  static cellheight = 0.15;

  private _font!: Font;
  get font(): Font { return this._font }

  private _titlematerial!: Material;
  get titlematerial(): Material { return this._titlematerial }

  private _uimaterial!: Material;
  get uimaterial(): Material { return this._uimaterial }

  private _accentmaterial!: Material;
  get accentmaterial(): Material { return this._accentmaterial }

  private _titleoffset = 0;
  get titleoffset(): number { return this._titleoffset }

  static uioffset = 1;
  static uiwidth = 1;

  public group!: Group;

  constructor({
    parent,
    title = 'Controls',
    titleoffset = 0,
    uioffset = 2,
    uiwidth = 1.5,
    font,
    titlematerial,
    uimaterial,
    accentmaterial,
  }: {
    parent?: GUIBase,
    title?: string,
    titleoffset?: number,
    uioffset?: number,
    uiwidth?: number,
    font: Font,
    titlematerial?: Material,
    uimaterial?: Material,
    accentmaterial?: Material,
  }
  ) {
    super(parent, title);

    if (!ThreeGUI._init) {
      GUIFactory.register('options', () => { return new ThreeOption() });
      GUIFactory.register('number', () => { return new ThreeNumber() });
      GUIFactory.register('boolean', () => { return new ThreeBoolean() });
      GUIFactory.register('string', () => { return new ThreeString() });
      GUIFactory.register('function', () => { return new ThreeButton() });
      GUIFactory.register('color', () => { return new ThreeColor() });

      ThreeGUI.uioffset = uioffset;
      ThreeGUI.uiwidth = uiwidth;

      ThreeGUI._init = true;
    }

    this._font = font;
    this._titleoffset = titleoffset;

    if (titlematerial)
      this._titlematerial = titlematerial;
    else
      this._titlematerial = ThreeGUI.default_titlematerial;


    if (uimaterial)
      this._uimaterial = uimaterial
    else
      this._uimaterial = ThreeGUI.default_uimaterial;

    if (accentmaterial)
      this._accentmaterial = accentmaterial
    else
      this._accentmaterial = ThreeGUI.default_accentmaterial;


    this.group = new Group();

    this.group.add(this.buildFolderText(title, ThreeGUI.position, 0));
    if (!parent) ThreeGUI.position -= ThreeGUI.cellheight;
  }

  buildFolderText(title: string, position: number, offset: number): Object3D {
    const textGeo = new TextGeometry(title, {
      font: this.font,
      size: 0.1,
      height: 0.01,
      bevelEnabled: false,
      curveSegments: 4,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,

    });
    textGeo.computeBoundingBox();

    const mesh = new Mesh(textGeo, this.titlematerial);
    mesh.position.y = position;
    mesh.position.x = offset;
    return mesh;
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
      const oc = <ThreeOption>(<ThreeOption>GUIFactory.create(className)).initialize(this, object, property).build();
      oc.options($1);
      return oc;
    }
    else {
      const initialValue = object[property];
      const className = typeof initialValue;
      switch (className) {

        case 'number':
          const nc = <ThreeNumber>(<ThreeNumber>GUIFactory.create(className)).initialize(this, object, property).build();
          nc.setmin($1).setmax(max).setstep(step);
          return nc;

        case 'boolean':
          return (<ThreeBoolean>GUIFactory.create(className)).initialize(this, object, property).build();

        default:
        case 'string':
          return (<ThreeString>GUIFactory.create(className)).initialize(this, object, property).build();

        case 'function':
          return (<ThreeButton>GUIFactory.create(className)).initialize(this, object, property).build();
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
    const cc = <ThreeColor>(<ThreeColor>GUIFactory.create(className)).initialize(this, object, property).build();
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
    const gui = new ThreeGUI({ parent: this, title, font: this._font, titlematerial: this._titlematerial, titleoffset: this._titleoffset + 0.05 });
    this.group.add(gui.group);
    return gui;
  }

  addCustom(type: string, object: any, property: string): Controller {
    return (<ThreeController>GUIFactory.create(type)).initialize(this, object, property).build();
  }


  override settitle(title: string): GUIBase {
    super.settitle(title);
    return this;
  }
}
