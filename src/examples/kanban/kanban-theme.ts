import { Material, MeshBasicMaterial, Object3D } from "three";

export interface KanbanTheme {
  DividerColor: string,
}

export class KanbanThemeObject extends Object3D implements KanbanTheme {
  DividerColor = 'white';

  changeTheme(newtheme: KanbanTheme) {
    this.DividerColor = newtheme.DividerColor;

    this.updateMaterial();
  }

  DividerMaterial!: Material;

  constructor() {
    super();

    this.DividerMaterial = new MeshBasicMaterial({ color: this.DividerColor });
  }

  updateMaterial() {
    (this.DividerMaterial as MeshBasicMaterial).color.setStyle(this.DividerColor);
  }
}

export const GlobalKanbanTheme = new KanbanThemeObject();
