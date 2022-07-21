import { Controller } from "../../guibase";
import { HTMLController } from "./htmlcontroller";

export class HTMLBoolean extends HTMLController {
  private $input!: HTMLInputElement;

  override build(): Controller {
    super.build();

    this.$input = document.createElement('input');
    this.$input.setAttribute('type', 'checkbox');
    this.$input.setAttribute('aria-labelledby', this.$name.id);

    this.$widget.appendChild(this.$input);

    this.$input.addEventListener('change', () => {
      this.setValue(this.$input.checked);
      this._callOnFinishChange();
    });

    this.$disable = this.$input;

    this.updateDisplay();
    return this;
  }

  override updateDisplay() {
    this.$input.checked = this.getValue();
    return this;
  }


}
