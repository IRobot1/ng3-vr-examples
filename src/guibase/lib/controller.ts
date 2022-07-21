import { GUIBase } from "./guibase";

/**
 * Base class for all controllers.
 */
export abstract class Controller {

  private _name!: string;
  private _changed = false;
  public _onChange!: (event: any) => void;
  private _onFinishChange!: (value: any) => void;
  private _listening = false;
  private _listenCallbackID?: number;
  private _listenPrevValue: any;

  public initialValue!: any;
  public children: Array<GUIBase> = [];
  public controllers: Array<Controller> = [];
  public parent!: GUIBase;
  public object!: any
  public property!: string;

  static nextNameID: any;

  register(parent: GUIBase, object: any, property: string): Controller {
    this.parent = parent;
    this.object = object;
    this.property = property;

    this.parent.children.push(this);
    this.parent.controllers.push(this);

    this._listenCallback = this._listenCallback.bind(this);

    this.initialValue = this.getValue();
    return this;
  }

  abstract build(): Controller;

  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(name: string): Controller {
    /**
     * The controller's name. Use `controller.name( 'Name' )` to modify this value.
     * @type {string}
     */
    this._name = name;
    return this;
  }

  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(callback: (event: any) => void) {
    /**
     * Used to access the function bound to `onChange` events. Don't modify this value directly.
     * Use the `controller.onChange( callback )` method instead.
     * @type {Function}
     */
    this._onChange = callback;
    return this;
  }

  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {

    this.parent._callOnChange(this);

    if (this._onChange !== undefined) {
      this._onChange.call(this, this.getValue());
    }

    this._changed = true;

  }

  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(callback: (value: any) => void) {
    /**
   * Used to access the function bound to `onFinishChange` events. Don't modify this value
   * directly. Use the `controller.onFinishChange( callback )` method instead.
   * @type {Function}
   */
    this._onFinishChange = callback;
    return this;
  }

  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {

    if (this._changed) {

      this.parent._callOnFinishChange(this);

      if (this._onFinishChange !== undefined) {
        this._onFinishChange.call(this, this.getValue());
      }

    }

    this._changed = false;

  }

  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset(): Controller {
    this.setValue(this.initialValue);
    this._callOnFinishChange();
    return this;
  }

  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(enabled = true) {
    return this.setdisable(!enabled);
  }

  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  private _disabled = false;

  setdisable(disabled = true): Controller {

    if (disabled !== this._disabled)
      this._disabled = disabled;

    return this;

  }

  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  private _hidden = false;
  get hidden(): boolean { return this._hidden }

  show(show = true): Controller {
    this._hidden = !show;
    return this;
  }

  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide(): Controller {
    return this.show(false);
  }


  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(listen = true): Controller {

    /**
     * Used to determine if the controller is currently listening. Don't modify this value
     * directly. Use the `controller.listen( true|false )` method instead.
     * @type {boolean}
     */
    this._listening = listen;

    if (this._listenCallbackID !== undefined) {
      cancelAnimationFrame(this._listenCallbackID);
      this._listenCallbackID = undefined;
    }

    if (this._listening) {
      this._listenCallback();
    }

    return this;

  }

  _listenCallback() {

    this._listenCallbackID = requestAnimationFrame(this._listenCallback);

    // To prevent framerate loss, make sure the value has changed before updating the display.
    // Note: save() is used here instead of getValue() only because of ColorController. The !== operator
    // won't work for color objects or arrays, but ColorController.save() always returns a string.

    const curValue = this.save();

    if (curValue !== this._listenPrevValue) {
      this.updateDisplay();
    }

    this._listenPrevValue = curValue;

  }

  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue(): any {
    return this.object[this.property];
  }

  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(value: any): Controller {
    this.object[this.property] = value;
    this._callOnChange();
    this.updateDisplay();
    return this;
  }

  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay(): Controller {
    return this;
  }

  load(value: any): Controller {
    this.setValue(value);
    this._callOnFinishChange();
    return this;
  }

  save(): any {
    return this.getValue();
  }

  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy(): void {
    this.listen(false);
    this.parent.children.splice(this.parent.children.indexOf(this), 1);
    this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1);
  }

}
