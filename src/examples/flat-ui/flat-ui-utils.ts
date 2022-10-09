import { EventEmitter } from "@angular/core";
import { Object3D, Shape, Vector3 } from "three";

export const LabelColor = 'white';
export const ButtonColor = '#505050';
export const HoverColor = 'blue';
export const ClickColor = 'cornflowerblue';
export const ButtonLabelColor = 'white';
export const NumberColor = 'cornflowerblue';
export const StringColor = 'lime';
export const CheckColor = 'cornflowerblue';
export const SlideColor = 'yellow';
export const ToggleFalseColor = 'white';
export const ToggleTrueColor = 'cornflowerblue';
export const RadioFalseColor = '#505050';
export const RadioTrueColor = 'cornflowerblue';
export const IconColor = 'white';
export const PanelColor = 'black';
export const PopupColor = 'gray';
export const SelectColor = 'white';
export const ProgressColor = 'green';

export function roundedRect(ctx: Shape, x: number, y: number, width: number, height: number, radius: number) {
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
}

export interface UIInput {
  text: string;
  inputopen: boolean;
  openinput: EventEmitter<Object3D>;
}
