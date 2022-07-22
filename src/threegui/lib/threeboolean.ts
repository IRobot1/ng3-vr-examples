import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { Controller } from "../../guibase";
import { ThreeController } from "./threecontroller";
import { ThreeGUI } from "./threegui";

export class ThreeBoolean extends ThreeController {
  private mesh!: Mesh;

  override build(): Controller {
    super.build();

    const parent = <ThreeGUI>this.parent;

    const geometry = new BoxGeometry(ThreeGUI.cellheight - 0.01, ThreeGUI.cellheight - 0.01, 0.01);

    this.mesh = new Mesh(geometry, parent.uimaterial);
    this.mesh.position.x = ThreeGUI.uioffset - ThreeGUI.uioffset / 2 + ThreeGUI.cellheight*2 - 0.02;
    this.mesh.position.y = this.position + 0.04;

    this.group.add(this.mesh);

    return this;
  }
}
