import { Object3D } from "three";

export const THEME_CHANGE_EVENT = 'themechanged';

export interface FlatUITheme {
  LabelColor: string,
  ButtonColor: string,
  HoverColor: string,
  ClickColor: string,
  ButtonLabelColor: string,
  NumberColor: string,
  StringColor: string,
  CheckColor: string,
  SlideColor: string,
  ToggleFalseColor: string,
  ToggleTrueColor: string,
  RadioFalseColor: string,
  RadioTrueColor: string,
  IconColor: string,
  PanelColor: string,
  PopupColor: string,
  SelectColor: string,
  ProgressColor: string,
  DisabledColor: string,
}
// just in case you want to add to the scheme when saving to GLTF

export class FlatUIThemeObject extends Object3D implements FlatUITheme {
  LabelColor = 'white';
  ButtonColor = '#505050';
  HoverColor = 'blue';
  ClickColor = 'cornflowerblue';
  ButtonLabelColor = 'white';
  NumberColor = 'cornflowerblue';
  StringColor = 'lime';
  CheckColor = 'cornflowerblue';
  SlideColor = 'yellow';
  ToggleFalseColor = 'white';
  ToggleTrueColor = 'cornflowerblue';
  RadioFalseColor = '#505050';
  RadioTrueColor = 'cornflowerblue';
  IconColor = 'white';
  PanelColor = 'black';
  PopupColor = 'gray';
  SelectColor = 'white';
  ProgressColor = 'green';
  DisabledColor = '#666666'

  // notify any object using the theme that it changed
  notify() {
    this.dispatchEvent({ type: THEME_CHANGE_EVENT })
  }

  changeTheme(newtheme: FlatUITheme) {
    this.LabelColor = newtheme.LabelColor
    this.ButtonColor = newtheme.ButtonColor
    this.HoverColor = newtheme.HoverColor
    this.ClickColor = newtheme.ClickColor
    this.ButtonLabelColor = newtheme.ButtonLabelColor
    this.NumberColor = newtheme.NumberColor
    this.StringColor = newtheme.StringColor
    this.CheckColor = newtheme.CheckColor
    this.SlideColor = newtheme.SlideColor
    this.ToggleFalseColor = newtheme.ToggleFalseColor
    this.ToggleTrueColor = newtheme.ToggleTrueColor
    this.RadioFalseColor = newtheme.RadioFalseColor
    this.RadioTrueColor = newtheme.RadioTrueColor
    this.IconColor = newtheme.IconColor
    this.PanelColor = newtheme.PanelColor
    this.PopupColor = newtheme.PopupColor
    this.SelectColor = newtheme.SelectColor
    this.ProgressColor = newtheme.ProgressColor
    this.DisabledColor = newtheme.DisabledColor
    this.notify();
  }
}

export const GlobalFlatUITheme = new FlatUIThemeObject();
