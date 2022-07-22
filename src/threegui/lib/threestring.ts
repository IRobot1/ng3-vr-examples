import { BoxGeometry, Mesh } from "three";
import { TextGeometry } from "three-stdlib";
import { Controller } from "../../guibase";
import { ThreeController } from "./threecontroller";
import { ThreeGUI } from "./threegui";

export class ThreeString extends ThreeController {
  private inputbox!: Mesh;
  private value!: Mesh;

  override build(): Controller {
    super.build();

    const parent = <ThreeGUI>this.parent;

    const geometry = new BoxGeometry(ThreeGUI.uiwidth, ThreeGUI.cellheight - 0.01, 0.01);

    this.inputbox = new Mesh(geometry, parent.uimaterial);
    this.inputbox.position.x = ThreeGUI.uioffset - 0.04;
    this.inputbox.position.y = this.position + 0.04;

    this.group.add(this.inputbox);

    this.updateText();
    return this;
  }

  updateText() {
    const parent = <ThreeGUI>this.parent;
    if (this.value) {
      this.inputbox.remove(this.value);
    }
    const textGeo = new TextGeometry(String(this.getValue()), {
      font: parent.font,
      size: 0.1,
      height: 0.01,
      bevelEnabled: false,
      curveSegments: 4,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,

    });
    textGeo.computeBoundingBox();

    this.value = new Mesh(textGeo, parent.accentmaterial);
    this.value.position.x = - ThreeGUI.uiwidth / 2 + 0.05;
    this.value.position.y = -0.04;

    this.inputbox.add(this.value);
  }

  override updateDisplay(): Controller {
    this.updateText();
    return this;
  }

}
