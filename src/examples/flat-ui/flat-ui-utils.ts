import { EventEmitter } from "@angular/core";
import { Object3D, Shape, Vector3 } from "three";

export const HEIGHT_CHANGED_EVENT = 'heightchanged';
export const WIDTH_CHANGED_EVENT = 'widthchanged';
export const LAYOUT_EVENT = 'layout';


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
