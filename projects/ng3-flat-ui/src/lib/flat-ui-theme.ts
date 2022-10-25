import { LineBasicMaterial, Material, MeshBasicMaterial, Object3D } from "three";

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
  IconColor: string,
  PanelColor: string,
  PopupColor: string,
  SelectColor: string,
  ProgressColor: string,
  DisabledColor: string,
  OutlineColor: string,
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
  IconColor = 'white';
  PanelColor = 'black';
  PopupColor = 'gray';
  SelectColor = 'white';
  ProgressColor = 'green';
  DisabledColor = '#666666';
  OutlineColor = 'white';

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
    this.IconColor = newtheme.IconColor
    this.PanelColor = newtheme.PanelColor
    this.PopupColor = newtheme.PopupColor
    this.SelectColor = newtheme.SelectColor
    this.ProgressColor = newtheme.ProgressColor
    this.DisabledColor = newtheme.DisabledColor;
    this.OutlineColor = newtheme.OutlineColor;

    (this.ButtonMaterial as MeshBasicMaterial).color.setStyle(newtheme.ButtonColor);

    (this.LabelMaterial as MeshBasicMaterial).color.setStyle(newtheme.LabelColor);
    (this.NumberMaterial as MeshBasicMaterial).color.setStyle(newtheme.NumberColor);
    (this.StringMaterial as MeshBasicMaterial).color.setStyle(newtheme.StringColor);

    (this.ProgressMaterial as MeshBasicMaterial).color.setStyle(newtheme.ProgressColor);
    (this.SliderMaterial as MeshBasicMaterial).color.setStyle(newtheme.SlideColor);
    (this.CheckMaterial as MeshBasicMaterial).color.setStyle(newtheme.CheckColor);

    (this.ToggleFalseMaterial as MeshBasicMaterial).color.setStyle(newtheme.ToggleFalseColor);
    (this.ToggleTrueMaterial as MeshBasicMaterial).color.setStyle(newtheme.ToggleTrueColor);

    (this.PanelMaterial as MeshBasicMaterial).color.setStyle(newtheme.PanelColor);
    (this.PopupMaterial as MeshBasicMaterial).color.setStyle(newtheme.PopupColor);

    (this.OutlineMaterial as LineBasicMaterial).color.setStyle(newtheme.OutlineColor);


    this.notify();
  }

  LabelMaterial!: Material;
  ButtonMaterial!: Material;
  HoverMaterial!: Material;
  ClickMaterial!: Material;
  ButtonLabelMaterial!: Material;
  NumberMaterial!: Material;
  StringMaterial!: Material;
  CheckMaterial!: Material;
  SliderMaterial!: Material;
  ToggleFalseMaterial!: Material;
  ToggleTrueMaterial!: Material;
  IconMaterial!: Material;
  PanelMaterial!: Material;
  PopupMaterial!: Material;
  SelectMaterial!: Material;
  ProgressMaterial!: Material;
  DisabledMaterial!: Material;
  OutlineMaterial!: Material;

  constructor() {
    super();

    this.ButtonMaterial = new MeshBasicMaterial({ color: this.ButtonColor });

    this.LabelMaterial = new MeshBasicMaterial({ color: this.LabelColor });
    this.NumberMaterial = new MeshBasicMaterial({ color: this.NumberColor });
    this.StringMaterial = new MeshBasicMaterial({ color: this.StringColor });

    this.ProgressMaterial = new MeshBasicMaterial({ color: this.ProgressColor });
    this.SliderMaterial = new MeshBasicMaterial({ color: this.SlideColor });
    this.CheckMaterial = new MeshBasicMaterial({ color: this.CheckColor });

    this.ToggleFalseMaterial = new MeshBasicMaterial({ color: this.ToggleFalseColor });
    this.ToggleTrueMaterial = new MeshBasicMaterial({ color: this.ToggleTrueColor });

    this.PanelMaterial = new MeshBasicMaterial({ color: this.PanelColor });
    this.PopupMaterial = new MeshBasicMaterial({ color: this.PopupColor });

    this.OutlineMaterial = new LineBasicMaterial({ color: this.OutlineColor });


  }


}

export const GlobalFlatUITheme = new FlatUIThemeObject();
