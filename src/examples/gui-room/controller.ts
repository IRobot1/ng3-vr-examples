/** @module Controller */

import { GUI } from "./gui";

/**
 * Base class for all controllers.
 */
export abstract class Controller {
  private _disabled = false;
  private _hidden = false;

  private _name!: string;
  private _changed = false;
  public _onChange!: (event: any) => void;
  private _onFinishChange!: (value: any) => void;
  private _listening = false;
  private _listenCallbackID?: number;
  private _listenPrevValue: any;

  public initialValue!: any;
  public children: Array<GUI> = [];
  public controllers: Array<Controller> = [];
  public parent!: GUI;
  public object!: any
  public property!: string;

  register(parent: GUI, object: any, property: string): Controller {
    this.parent = parent;
    this.object = object;
    this.property = property;

    this.parent.children.push(this);
    this.parent.controllers.push(this);

    this._listenCallback = this._listenCallback.bind(this);

    this.name(property);
    this.initialValue = this.getValue();
    return this;
  }

  render(): Controller {
    return this;
  }

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
    return this.disable(!enabled);
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
  disable(disabled = true) {

    if (disabled === this._disabled) return this;

    this._disabled = disabled;

    //this.domElement.classList.toggle('disabled', disabled);
    //this.$disable.toggleAttribute('disabled', disabled);

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
  show(show = true) {

    this._hidden = !show;

    //this.domElement.style.display = this._hidden ? 'none' : '';

    return this;

  }

  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(false);
  }

  ///**
  // * Destroys this controller and replaces it with a new option controller. Provided as a more
  // * descriptive syntax for `gui.add`, but primarily for compatibility with dat.gui.
  // *
  // * Use caution, as this method will destroy old references to this controller. It will also
  // * change controller order if called out of sequence, moving the option controller to the end of
  // * the GUI.
  // * @example
  // * // safe usage
  // *
  // * gui.add( object1, 'property' ).options( [ 'a', 'b', 'c' ] );
  // * gui.add( object2, 'property' );
  // *
  // * // danger
  // *
  // * const c = gui.add( object1, 'property' );
  // * gui.add( object2, 'property' );
  // *
  // * c.options( [ 'a', 'b', 'c' ] );
  // * // controller is now at the end of the GUI even though it was added first
  // *
  // * assert( c.parent.children.indexOf( c ) === -1 )
  // * // c references a controller that no longer exists
  // *
  // * @param {object|Array} options
  // * @returns {Controller}
  // */
  //options(options: object | Array<any>) {
  //  const controller = this.parent.add(this.object, this.property, options);
  //  controller.name(this._name);
  //  this.destroy();
  //  return controller;
  //}

  ///**
  // * Sets the minimum value. Only works on number controllers.
  // * @param {number} min
  // * @returns {this}
  // */
  //// eslint-disable-next-line no-unused-vars
  //min(min: number): Controller {
  //  return this;
  //}

  ///**
  // * Sets the maximum value. Only works on number controllers.
  // * @param {number} max
  // * @returns {this}
  // */
  //// eslint-disable-next-line no-unused-vars
  //max(max: number): Controller {
  //  return this;
  //}

  ///**
  // * Values set by this controller will be rounded to multiples of `step`. Only works on number
  // * controllers.
  // * @param {number} step
  // * @returns {this}
  // */
  //// eslint-disable-next-line no-unused-vars
  //step(step?: number): Controller {
  //  return this;
  //}

  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  // eslint-disable-next-line no-unused-vars
  decimals(decimals: number): Controller {
    return this;
  }

  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(listen = true) {

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
    //this.parent.$children.removeChild(this.domElement);
  }

}
