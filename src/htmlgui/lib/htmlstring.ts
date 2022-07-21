import { Controller } from "../../guibase";
import { HTMLController } from "./htmlcontroller";

export class HTMLString extends HTMLController {
  private $input!: HTMLInputElement;

  override build(): Controller {
    super.build();

    this.$input = document.createElement('input');
    this.$input.setAttribute('type', 'text');
    this.$input.setAttribute('aria-labelledby', this.$name.id);

    this.$input.addEventListener('input', () => {
      this.setValue(this.$input.value);
    });

    this.$input.addEventListener('keydown', e => {
      if (e.code === 'Enter') {
        this.$input.blur();
      }
    });

    this.$input.addEventListener('blur', () => {
      this._callOnFinishChange();
    });

    this.$widget.appendChild(this.$input);

    this.$disable = this.$input;

    this.updateDisplay();
    return this;
  }

  override updateDisplay(): Controller {
    this.$input.value = this.getValue();
    return this;
  }

}
