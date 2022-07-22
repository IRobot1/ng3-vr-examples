import { Group, Object3D } from "three";
import { Controller } from "../../guibase";
import { ThreeGUI } from "./threegui";

export class ThreeController extends Controller {
  public group!: Group;
  public position!: number;

  private text!: Object3D;

  initialize(parent: ThreeGUI, object: any, property: string): ThreeController {
    super.register(parent, object, property);
    ThreeGUI.position -= ThreeGUI.cellheight;
    this.position = ThreeGUI.position;
    return this;
  }

  override build(): Controller {
    const parent = <ThreeGUI>this.parent;
    this.group = new Group();
    parent.group.add(this.group);

    Controller.nextNameID = Controller.nextNameID || 0;
    this.group.name = `three-gui-${++Controller.nextNameID}`;

    this.parent.children.push(this);
    this.parent.controllers.push(this);

    this._listenCallback = this._listenCallback.bind(this);

    this.name(this.property);
    return this;
  }

  override name(name: string): Controller {
    super.name(name);

    if (this.text) {
      this.group.remove(this.text);
    }

    const parent = <ThreeGUI>this.parent;
    this.text = parent.buildFolderText(name, this.position, parent.titleoffset)

    this.group.add(this.text);

    return this;
  }
  override show(show = true): Controller {
    super.show(show);
    this.group.visible = show;
    return this;
  }


  override destroy(): void {
    super.destroy();
    //this.parent.$children.removeChild(this.domElement);
  }
}
