import { ThreeController } from "./threecontroller";

export class ThreeColor extends ThreeController {
  private _rgbScale = 1;

  rgbScale(value: number): ThreeColor {
    this._rgbScale = value;
    return this;
  }


}
