import { BoxGeometry, CylinderGeometry, Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { Controller } from "../../guibase";
import { ThreeController } from "./threecontroller";
import { ThreeGUI } from "./threegui";

export class ThreeBoolean extends ThreeController {
  private mesh!: Mesh;
  private check!: Mesh;

  override build(): Controller {
    super.build();

    const parent = <ThreeGUI>this.parent;

    const box = new BoxGeometry(ThreeGUI.cellheight - 0.01, ThreeGUI.cellheight - 0.01, 0.01);
    this.mesh = new Mesh(box, parent.uimaterial);

    this.mesh.position.x = ThreeGUI.uioffset - ThreeGUI.uioffset / 2 + ThreeGUI.cellheight*2 - 0.02;
    this.mesh.position.y = this.position + 0.04;

    this.group.add(this.mesh);

    const size = ThreeGUI.cellheight - 0.04;
    const sphere = new BoxGeometry(size,  size, 0.02);
    this.check = new Mesh(sphere, parent.accentmaterial);

    this.mesh.add(this.check);

    this.updateDisplay();
    return this;
  }

  override updateDisplay() {
    this.check.visible = this.getValue();
    return this;
  }

}
