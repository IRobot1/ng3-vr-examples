import { Material, MeshBasicMaterial, Object3D } from "three";

export interface ShapeTheme {
  ConditionColor: string,
  ControlColor: string,
  EventColor: string,
  ExpressionColor: string,
  LabelColor: string,
  TextColor: string,
  OutlineColor: string,
}
// just in case you want to add to the scene when saving to GLTF

export class ShapeThemeObject extends Object3D implements ShapeTheme {
  ConditionColor = 'blue'
  ControlColor = 'orange'
  EventColor = 'gold'
  ExpressionColor = 'green'
  LabelColor = 'white'
  TextColor = 'black'
  OutlineColor = 'black'

  changeTheme(newtheme: ShapeTheme) {
    this.ConditionColor = newtheme.ConditionColor
    this.ControlColor = newtheme.ControlColor
    this.EventColor = newtheme.EventColor
    this.ExpressionColor = newtheme.ExpressionColor
    this.LabelColor = newtheme.LabelColor
    this.TextColor = newtheme.TextColor
    this.OutlineColor = newtheme.OutlineColor
  }

  ConditionMaterial!: Material;
  ControlMaterial!: Material;
  EventMaterial!: Material;
  ExpressionMaterial!: Material;
  LabelMaterial!: Material;
  TextMaterial!: Material;
  OutlineMaterial!: Material;

  constructor() {
    super();

    this.ConditionMaterial = new MeshBasicMaterial({ color: this.ConditionColor });
    this.ControlMaterial = new MeshBasicMaterial({ color: this.ControlColor });
    this.EventMaterial = new MeshBasicMaterial({ color: this.EventColor });
    this.ExpressionMaterial = new MeshBasicMaterial({ color: this.ExpressionColor });

    this.TextMaterial = new MeshBasicMaterial({ color: this.TextColor });
    this.LabelMaterial = new MeshBasicMaterial({ color: this.LabelColor });

    this.OutlineMaterial = new MeshBasicMaterial({ color: this.OutlineColor });
  }

  updateMaterial() {
    (this.ConditionMaterial as MeshBasicMaterial).color.setStyle(this.ConditionColor);
    (this.ControlMaterial as MeshBasicMaterial).color.setStyle(this.ControlColor);
    (this.EventMaterial as MeshBasicMaterial).color.setStyle(this.EventColor);
    (this.ExpressionMaterial as MeshBasicMaterial).color.setStyle(this.ExpressionColor);

    (this.LabelMaterial as MeshBasicMaterial).color.setStyle(this.LabelColor);
    (this.TextMaterial as MeshBasicMaterial).color.setStyle(this.TextColor);

    (this.OutlineMaterial as MeshBasicMaterial).color.setStyle(this.OutlineColor);
  }

}

export const GlobalShapeTheme = new ShapeThemeObject();
