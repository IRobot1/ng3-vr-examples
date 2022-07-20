import { Controller } from "./controller";

export class StringController extends Controller {


  override render(): Controller {
    //this.$input = document.createElement('input');
    //this.$input.setAttribute('type', 'text');
    //this.$input.setAttribute('aria-labelledby', this.$name.id);

    //this.$input.addEventListener('input', () => {
    //  this.setValue(this.$input.value);
    //});

    //this.$input.addEventListener('keydown', e => {
    //  if (e.code === 'Enter') {
    //    this.$input.blur();
    //  }
    //});

    //this.$input.addEventListener('blur', () => {
    //  this._callOnFinishChange();
    //});

    //this.$widget.appendChild(this.$input);

    //this.$disable = this.$input;

    this.updateDisplay();
    return this;
  }

  override updateDisplay(): Controller {
    //this.$input.value = this.getValue();
    return this;
  }

}
