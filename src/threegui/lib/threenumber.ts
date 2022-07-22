import { BoxGeometry, Mesh, Object3D } from "three";
import { TextGeometry } from "three-stdlib";
import { Controller } from "../../guibase";
import { ThreeController } from "./threecontroller";
import { ThreeGUI } from "./threegui";

export class ThreeNumber extends ThreeController {
  private inputbox!: Mesh;
  private sliderbox!: Mesh;
  private slider!: Mesh;
  private value!: Mesh;
  private offset = 0;

  override build(): Controller {
    super.build();


    this.initInput(ThreeGUI.uioffset-0.04, ThreeGUI.uiwidth);
    this.updateText(this.getValue(), ThreeGUI.uiwidth);

    return this;
  }

  initInput(offset: number, width: number) {
    if (this.inputbox) {
      this.group.remove(this.inputbox);
    }

    const geometry = new BoxGeometry(width, ThreeGUI.cellheight - 0.01, 0.01);

    const parent = <ThreeGUI>this.parent;
    this.inputbox = new Mesh(geometry, parent.uimaterial);
    this.inputbox.position.x = offset;
    this.inputbox.position.y = this.position + 0.04;

    this.group.add(this.inputbox);
  }

  initSlider() {
    this.hasSlider = true;

    const parent = <ThreeGUI>this.parent;

    // make input box smaller and move right
    this.initInput(ThreeGUI.uioffset + ThreeGUI.uiwidth * 0.25, ThreeGUI.uiwidth / 2);
    this.updateText(this.getValue(), ThreeGUI.uiwidth / 2);

    // slider box
    const box = new BoxGeometry(ThreeGUI.uiwidth / 2, ThreeGUI.cellheight - 0.01, 0.01);

    this.sliderbox = new Mesh(box, parent.uimaterial);
    this.sliderbox.position.x = ThreeGUI.uioffset - ThreeGUI.uiwidth * 0.25 -0.04;
    this.sliderbox.position.y = this.position + 0.04;

    this.group.add(this.sliderbox);

    // slider bar
    const bar = new BoxGeometry(0.01, 0.14, 0.02);
    this.slider = new Mesh(bar, parent.accentmaterial);
    this.sliderbox.add(this.slider);
  }

  updateText(newvalue: string, width: number) {
    const parent = <ThreeGUI>this.parent;
    if (this.value) {
      this.inputbox.remove(this.value);
    }
    const textGeo = new TextGeometry(newvalue, {
      font: parent.font,
      size: 0.1,
      height: 0.01,
      bevelEnabled: false,
      curveSegments: 4,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,

    });
    textGeo.computeBoundingBox();

    this.value = new Mesh(textGeo, parent.accentmaterial);
    this.value.position.x = - width / 2 + 0.05;
    this.value.position.y = -0.04;

    this.inputbox.add(this.value);
  }

  override updateDisplay(): Controller {

    const value = this.getValue();

    if (this.hasSlider) {
      const range = this.max - this.min;
      let percent = (value - this.min) / range;
      percent = Math.max(0, Math.min(percent, 1));

      const width = ThreeGUI.uiwidth / 4
      this.slider.position.x = -width + percent * width * 2;
    }

    //if (!this._inputFocused) {
    this.updateText(this.decimals === undefined ? value : value.toFixed(this.decimals), ThreeGUI.uiwidth/2 );
    //}

    return this;

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
