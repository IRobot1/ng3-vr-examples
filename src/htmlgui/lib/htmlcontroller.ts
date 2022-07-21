import { Controller } from "../../guibase";
import { HTMLGUI } from "./htmlgui";

export class HTMLController extends Controller {
  public domElement!: HTMLDivElement;
  public $name!: HTMLDivElement;
  public $widget: any;
  public $disable: any;

  private _className!: string;
  private _widgetTag!: string;

  initialize(parent: HTMLGUI, object: any, property: string, className: string, widgetTag = 'div'): HTMLController {
    super.register(parent, object, property);
    this._className = className;
    this._widgetTag = widgetTag;
    return this;
  }

  override build(): Controller {
    /**
         * The outermost container DOM element for this controller.
         * @type {HTMLElement}
         */
    this.domElement = document.createElement('div');
    this.domElement.classList.add('controller');
    this.domElement.classList.add(this._className);

    /**
     * The DOM element that contains the controller's name.
     * @type {HTMLElement}
     */
    this.$name = document.createElement('div');
    this.$name.classList.add('name');

    Controller.nextNameID = Controller.nextNameID || 0;
    this.$name.id = `lil-gui-name-${++Controller.nextNameID}`;

    /**
     * The DOM element that contains the controller's "widget" (which differs by controller type).
     * @type {HTMLElement}
     */
    this.$widget = document.createElement(this._widgetTag);
    this.$widget.classList.add('widget');

    /**
     * The DOM element that receives the disabled attribute when using disable()
     * @type {HTMLElement}
     */
    this.$disable = this.$widget;

    this.domElement.appendChild(this.$name);
    this.domElement.appendChild(this.$widget);

    this.parent.children.push(this);
    this.parent.controllers.push(this);

    this.parent.$children.appendChild(this.domElement);

    this._listenCallback = this._listenCallback.bind(this);

    return this;
  }

  override show(show = true): Controller {
    this.domElement.style.display = this.hidden ? 'none' : '';
    return this;
  }

  override destroy(): void {
    super.destroy();
    this.parent.$children.removeChild(this.domElement);
  }
}
