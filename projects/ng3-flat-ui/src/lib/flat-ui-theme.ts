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
  ResizeColor: string,
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
  ResizeColor = 'white';

  // notify any object using the theme that it changed
  notify() {
    this.updateMaterial();
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
    this.ResizeColor = newtheme.ResizeColor;

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
  TitleMaterial!: Material;
  ResizeMaterial!: Material;

  constructor() {
    super();

    this.ButtonMaterial = new MeshBasicMaterial({ color: this.ButtonColor });
    this.IconMaterial = new MeshBasicMaterial({ color: this.IconColor });
    this.DisabledMaterial = new MeshBasicMaterial({ color: this.DisabledColor });

    this.LabelMaterial = new MeshBasicMaterial({ color: this.LabelColor });
    this.NumberMaterial = new MeshBasicMaterial({ color: this.NumberColor });
    this.StringMaterial = new MeshBasicMaterial({ color: this.StringColor });

    this.ProgressMaterial = new MeshBasicMaterial({ color: this.ProgressColor });
    this.SliderMaterial = new MeshBasicMaterial({ color: this.SlideColor });
    this.CheckMaterial = new MeshBasicMaterial({ color: this.CheckColor });

    this.ToggleFalseMaterial = new MeshBasicMaterial({ color: this.ToggleFalseColor });
    this.ToggleTrueMaterial = new MeshBasicMaterial({ color: this.ToggleTrueColor });

    this.PanelMaterial = new MeshBasicMaterial({ color: this.PanelColor });
    this.TitleMaterial = new MeshBasicMaterial({ color: this.PanelColor, transparent: true, opacity: 0.3 });

    this.PopupMaterial = new MeshBasicMaterial({ color: this.PopupColor });
    this.ResizeMaterial = new MeshBasicMaterial({ color: this.ResizeColor });

    this.OutlineMaterial = new LineBasicMaterial({ color: this.OutlineColor });


  }

  updateMaterial() {
    (this.ButtonMaterial as MeshBasicMaterial).color.setStyle(this.ButtonColor);
    (this.IconMaterial as MeshBasicMaterial).color.setStyle(this.IconColor);
    (this.DisabledMaterial as MeshBasicMaterial).color.setStyle(this.DisabledColor);

    (this.LabelMaterial as MeshBasicMaterial).color.setStyle(this.LabelColor);
    (this.NumberMaterial as MeshBasicMaterial).color.setStyle(this.NumberColor);
    (this.StringMaterial as MeshBasicMaterial).color.setStyle(this.StringColor);

    (this.ProgressMaterial as MeshBasicMaterial).color.setStyle(this.ProgressColor);
    (this.SliderMaterial as MeshBasicMaterial).color.setStyle(this.SlideColor);
    (this.CheckMaterial as MeshBasicMaterial).color.setStyle(this.CheckColor);

    (this.ToggleFalseMaterial as MeshBasicMaterial).color.setStyle(this.ToggleFalseColor);
    (this.ToggleTrueMaterial as MeshBasicMaterial).color.setStyle(this.ToggleTrueColor);

    (this.PanelMaterial as MeshBasicMaterial).color.setStyle(this.PanelColor);
    (this.TitleMaterial as MeshBasicMaterial).color.setStyle(this.PanelColor);

    (this.PopupMaterial as MeshBasicMaterial).color.setStyle(this.PopupColor);
    (this.ResizeMaterial as MeshBasicMaterial).color.setStyle(this.ResizeColor);

    (this.OutlineMaterial as LineBasicMaterial).color.setStyle(this.OutlineColor);
  }

}

export const GlobalFlatUITheme = new FlatUIThemeObject();
