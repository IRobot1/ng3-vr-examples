import { Material, MeshBasicMaterial, Object3D } from "three";

export const PIN_VALUE_CHANGED = 'pinhanged';

export interface NodeUITheme {
  StringColor: string,
}

// just in case you want to add to the scene when saving to GLTF

export class NodeUIThemeObject extends Object3D implements NodeUITheme {
  StringColor = 'red';

  changeTheme(newtheme: NodeUITheme) {
    this.StringColor = newtheme.StringColor
  }

  StringMaterial!: Material;

  constructor() {
    super();

    this.StringMaterial = new MeshBasicMaterial({ color: this.StringColor });

  }

  updateMaterial() {
    (this.StringMaterial as MeshBasicMaterial).color.setStyle(this.StringColor);
  }

}

export const GlobalNodeUITheme = new NodeUIThemeObject();
