import { ThreeController } from "./threecontroller";

export class ThreeNumber extends ThreeController {
  initSlider() {
    console.warn('implement threenumber initSlider')
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

  _getImplicitStep() {

    if (this._hasMin && this._hasMax) {
      return (this._max - this._min) / 1000;
    }

    return 0.1;

  }

  get _hasMin() {
    return this._min !== undefined;
  }

  get _hasMax() {
    return this._max !== undefined;
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

  setdecimals(decimals: number): ThreeNumber {
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

  setmin(min: number): ThreeNumber {
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

  setmax(max: number): ThreeNumber {
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

  setstep(step?: number): ThreeNumber {
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


}
