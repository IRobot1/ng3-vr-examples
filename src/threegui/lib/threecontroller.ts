import { Controller } from "../../guibase";
import { ThreeGUI } from "./threegui";

export class ThreeController extends Controller {

  initialize(parent: ThreeGUI, object: any, property: string, className: string, widgetTag = 'div'): ThreeController {
    super.register(parent, object, property);

    return this;
  }

  override build(): Controller {

    return this;
  }

  override show(show = true): Controller {
    //this.domElement.style.display = this.hidden ? 'none' : '';
    return this;
  }

  override destroy(): void {
    super.destroy();
    //this.parent.$children.removeChild(this.domElement);
  }
}
