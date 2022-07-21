import { Controller } from "../../guibase";
import { HTMLController } from "./htmlcontroller";

import { HTMLGUI } from "./htmlgui";

export class HTMLNumber extends HTMLController {
  private $input!: HTMLInputElement;
  private $slider: any;

  private _inputFocused = false;
  private $fill: any;

  override build(): Controller {
    super.build();

    this.$input = document.createElement('input');
    this.$input.setAttribute('type', 'number');
    this.$input.setAttribute('step', 'any');
    this.$input.setAttribute('aria-labelledby', this.$name.id);

    this.$widget.appendChild(this.$input);

    this.$disable = this.$input;

    const onInput = () => {

      let value = parseFloat(this.$input.value);

      if (isNaN(value)) return;

      if (this.stepExplicit) {
        value = this._snap(value);
      }

      this.setValue(this._clamp(value));

    };

    // Keys & mouse wheel
    // ---------------------------------------------------------------------

    const increment = (delta: any) => {

      const value = parseFloat(this.$input.value);

      if (isNaN(value)) return;

      this._snapClampSetValue(value + delta);

      // Force the input to updateDisplay when it's focused
      this.$input.value = this.getValue();

    };

    const onKeyDown = (e: any) => {
      if (e.code === 'Enter') {
        this.$input.blur();
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        increment(this.step * this._arrowKeyMultiplier(e));
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        increment(this.step * this._arrowKeyMultiplier(e) * -1);
      }
    };

    const onWheel = (e: any) => {
      if (this._inputFocused) {
        e.preventDefault();
        increment(this.step * this._normalizeMouseWheel(e));
      }
    };

    // Vertical drag
    // ---------------------------------------------------------------------

    let testingForVerticalDrag = false,
      initClientX: number,
      initClientY: number,
      prevClientY: number,
      initValue: any,
      dragDelta: any;

    // Once the mouse is dragged more than DRAG_THRESH px on any axis, we decide
    // on the user's intent: horizontal means highlight, vertical means drag.
    const DRAG_THRESH = 5;

    const onMouseDown = (e: any) => {

      initClientX = e.clientX;
      initClientY = prevClientY = e.clientY;
      testingForVerticalDrag = true;

      initValue = this.getValue();
      dragDelta = 0;

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

    };

    const onMouseMove = (e: any) => {

      if (testingForVerticalDrag) {

        const dx = e.clientX - initClientX;
        const dy = e.clientY - initClientY;

        if (Math.abs(dy) > DRAG_THRESH) {

          e.preventDefault();
          this.$input.blur();
          testingForVerticalDrag = false;
          this._setDraggingStyle(true, 'vertical');

        } else if (Math.abs(dx) > DRAG_THRESH) {

          onMouseUp();

        }

      }

      // This isn't an else so that the first move counts towards dragDelta
      if (!testingForVerticalDrag) {

        const dy = e.clientY - prevClientY;

        dragDelta -= dy * this.step * this._arrowKeyMultiplier(e);

        // Clamp dragDelta so we don't have 'dead space' after dragging past bounds.
        // We're okay with the fact that bounds can be undefined here.
        if (initValue + dragDelta > this.max) {
          dragDelta = this.max - initValue;
        } else if (initValue + dragDelta < this.min) {
          dragDelta = this.min - initValue;
        }

        this._snapClampSetValue(initValue + dragDelta);

      }

      prevClientY = e.clientY;

    };

    const onMouseUp = () => {
      this._setDraggingStyle(false, 'vertical');
      this._callOnFinishChange();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    // Focus state & onFinishChange
    // ---------------------------------------------------------------------

    const onFocus = () => {
      this._inputFocused = true;
    };

    const onBlur = () => {
      this._inputFocused = false;
      this.updateDisplay();
      this._callOnFinishChange();
    };

    this.$input.addEventListener('input', onInput);
    this.$input.addEventListener('keydown', onKeyDown);
    this.$input.addEventListener('wheel', onWheel, { passive: false });
    this.$input.addEventListener('mousedown', onMouseDown);
    this.$input.addEventListener('focus', onFocus);
    this.$input.addEventListener('blur', onBlur);

    this.updateDisplay();
    return this;
  }

  initSlider() {

    this.hasSlider = true;

    // Build DOM
    // ---------------------------------------------------------------------

    this.$slider = document.createElement('div');
    this.$slider.classList.add('slider');

    this.$fill = document.createElement('div');
    this.$fill.classList.add('fill');

    this.$slider.appendChild(this.$fill);
    this.$widget.insertBefore(this.$slider, this.$input);

    this.domElement.classList.add('hasSlider');

    // Map clientX to value
    // ---------------------------------------------------------------------

    const map = (v: number, a: number, b: number, c: number, d: number) => {
      return (v - a) / (b - a) * (d - c) + c;
    };

    const setValueFromX = (clientX: number) => {
      const rect = this.$slider.getBoundingClientRect();
      let value = map(clientX, rect.left, rect.right, this.min, this.max);
      this._snapClampSetValue(value);
    };

    // Mouse drag
    // ---------------------------------------------------------------------

    const mouseDown = (e: any) => {
      this._setDraggingStyle(true);
      setValueFromX(e.clientX);
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    };

    const mouseMove = (e: any) => {
      setValueFromX(e.clientX);
    };

    const mouseUp = () => {
      this._callOnFinishChange();
      this._setDraggingStyle(false);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };

    // Touch drag
    // ---------------------------------------------------------------------

    let testingForScroll = false, prevClientX: number, prevClientY: number;

    const beginTouchDrag = (e: any) => {
      e.preventDefault();
      this._setDraggingStyle(true);
      setValueFromX(e.touches[0].clientX);
      testingForScroll = false;
    };

    const onTouchStart = (e: any) => {

      if (e.touches.length > 1) return;

      // If we're in a scrollable container, we should wait for the first
      // touchmove to see if the user is trying to slide or scroll.
      if (this._hasScrollBar) {

        prevClientX = e.touches[0].clientX;
        prevClientY = e.touches[0].clientY;
        testingForScroll = true;

      } else {

        // Otherwise, we can set the value straight away on touchstart.
        beginTouchDrag(e);

      }

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);

    };

    const onTouchMove = (e: any) => {

      if (testingForScroll) {

        const dx = e.touches[0].clientX - prevClientX;
        const dy = e.touches[0].clientY - prevClientY;

        if (Math.abs(dx) > Math.abs(dy)) {

          // We moved horizontally, set the value and stop checking.
          beginTouchDrag(e);

        } else {

          // This was, in fact, an attempt to scroll. Abort.
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);

        }

      } else {

        e.preventDefault();
        setValueFromX(e.touches[0].clientX);

      }

    };
    const onTouchEnd = () => {
      this._callOnFinishChange();
      this._setDraggingStyle(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    // Mouse wheel
    // ---------------------------------------------------------------------

    // We have to use a debounced function to call onFinishChange because
    // there's no way to tell when the user is "done" mouse-wheeling.
    const callOnFinishChange = this._callOnFinishChange.bind(this);
    const WHEEL_DEBOUNCE_TIME = 400;
    let wheelFinishChangeTimeout: any;

    const onWheel = (e: any) => {

      // ignore vertical wheels if there's a scrollbar
      const isVertical = Math.abs(e.deltaX) < Math.abs(e.deltaY);
      if (isVertical && this._hasScrollBar) return;

      e.preventDefault();

      // set value
      const delta = this._normalizeMouseWheel(e) * this.step;
      this._snapClampSetValue(this.getValue() + delta);

      // force the input to updateDisplay when it's focused
      this.$input.value = this.getValue();

      // debounce onFinishChange
      clearTimeout(wheelFinishChangeTimeout);
      wheelFinishChangeTimeout = setTimeout(callOnFinishChange, WHEEL_DEBOUNCE_TIME);

    };

    this.$slider.addEventListener('mousedown', mouseDown);
    this.$slider.addEventListener('touchstart', onTouchStart, { passive: false });
    this.$slider.addEventListener('wheel', onWheel, { passive: false });

  }


  override updateDisplay(): Controller {

    const value = this.getValue();

    if (this.hasSlider) {

      let percent = (value - this.min) / (this.max - this.min);
      percent = Math.max(0, Math.min(percent, 1));

      this.$fill.style.width = percent * 100 + '%';

    }

    if (!this._inputFocused) {
      this.$input.value = this.decimals === undefined ? value : value.toFixed(this.decimals);
    }

    return this;

  }

  get _hasScrollBar() {
    const root = (<HTMLGUI>(<HTMLGUI>this.parent).root).$children;
    return root.scrollHeight > root.clientHeight;
  }



  private _setDraggingStyle(active: boolean, axis = 'horizontal') {
    if (this.$slider) {
      this.$slider.classList.toggle('active', active);
    }
    document.body.classList.toggle('lil-gui-dragging', active);
    document.body.classList.toggle(`lil-gui-${axis}`, active);
  }

  override setdisable(disabled = true): Controller {
    super.setdisable(disabled);
    this.domElement.classList.toggle('disabled', disabled);
    this.$disable.toggleAttribute('disabled', disabled);
    return this;
  }

  private _stepExplicit = false;
  get stepExplicit(): boolean { return this._stepExplicit; }

  public hasSlider = false;

  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  // eslint-disable-next-line no-unused-vars
  private _decimals = 0;
  get decimals(): number { return this._decimals };

  setdecimals(decimals: number): HTMLNumber {
    this._decimals = decimals;
    this.updateDisplay();
    return this;
  }

  ///**
  // * Sets the minimum value. Only works on number controllers.
  // * @param {number} min
  // * @returns {this}
  // */
  private _min!: number;
  get min(): number { return this._min }

  setmin(min: number): HTMLNumber {
    this._min = min;
    this._onUpdateMinMax();
    return this;
  }

  ///**
  // * Sets the maximum value. Only works on number controllers.
  // * @param {number} max
  // * @returns {this}
  // */
  private _max!: number;
  get max(): number { return this._max }

  setmax(max: number): HTMLNumber {
    this._max = max;
    this._onUpdateMinMax();
    return this;
  }

  ///**
  // * Values set by this controller will be rounded to multiples of `step`. Only works on number
  // * controllers.
  // * @param {number} step
  // * @returns {this}
  // */
  private _step!: number;
  get step(): number { return this._step };

  set step(newvalue: number) { this.setstep(newvalue) }

  setstep(step?: number): HTMLNumber {
    if (step) {
      this._step = step;
      this._stepExplicit = true;
    }
    else {
      this._step = this._getImplicitStep();
      this._stepExplicit = false;
    }
    return this;
  }





  _getImplicitStep() {

    if (this._hasMin && this._hasMax) {
      return (this._max - this._min) / 1000;
    }

    return 0.1;

  }

  _onUpdateMinMax() {

    if (!this.hasSlider && this._hasMin && this._hasMax) {

      // If this is the first time we're hearing about min and max
      // and we haven't explicitly stated what our step is, let's
      // update that too.
      if (!this._stepExplicit) {
        this.setstep(this._getImplicitStep());
      }

      this.initSlider();
      this.updateDisplay();

    }

  }

  _normalizeMouseWheel(e: any) {

    let { deltaX, deltaY } = e;

    // Safari and Chrome report weird non-integral values for a notched wheel,
    // but still expose actual lines scrolled via wheelDelta. Notched wheels
    // should behave the same way as arrow keys.
    if (Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta) {
      deltaX = 0;
      deltaY = -e.wheelDelta / 120;
      deltaY *= this._stepExplicit ? 1 : 10;
    }

    const wheel = deltaX + -deltaY;

    return wheel;

  }

  _arrowKeyMultiplier(e: any) {

    let mult = this._stepExplicit ? 1 : 10;

    if (e.shiftKey) {
      mult *= 10;
    } else if (e.altKey) {
      mult /= 10;
    }

    return mult;

  }

  _snap(value: number) {

    // This would be the logical way to do things, but floating point errors.
    // return Math.round( value / this._step ) * this._step;

    // Using inverse step solves a lot of them, but not all
    // const inverseStep = 1 / this._step;
    // return Math.round( value * inverseStep ) / inverseStep;

    // Not happy about this, but haven't seen it break.
    const r = Math.round(value / this._step) * this._step;
    return parseFloat(r.toPrecision(15));

  }

  _clamp(value: number) {
    // either condition is false if min or max is undefined
    if (value < this._min) value = this._min;
    if (value > this._max) value = this._max;
    return value;
  }

  _snapClampSetValue(value: number) {
    this.setValue(this._clamp(this._snap(value)));
  }

  get _hasMin() {
    return this._min !== undefined;
  }

  get _hasMax() {
    return this._max !== undefined;
  }

}
