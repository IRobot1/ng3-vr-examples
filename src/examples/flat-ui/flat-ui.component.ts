import { AfterViewInit, Component, OnInit } from "@angular/core";

import { DoubleSide, Euler, Object3D, Quaternion, Side, Texture, TextureLoader, Vector3 } from "three";
import { make, NgtLoader, NgtTriple } from "@angular-three/core";

import { FlatUITheme, GlobalFlatUITheme, InteractiveObjects, ListItem, UIInput } from "ng3-flat-ui";

import { CameraService } from "../../app/camera.service";

const MatrixTheme: FlatUITheme = {
  LabelColor: 'gray',
  ButtonColor: 'green',
  HoverColor: 'lightgreen',
  ClickColor: 'black',
  ButtonLabelColor: 'gray',
  NumberColor: 'lime',
  StringColor: 'lime',
  CheckColor: 'lime',
  SlideColor: 'lime',
  ToggleFalseColor: 'darkgreen',
  ToggleTrueColor: 'lime',
  IconColor: 'lime',
  PanelColor: '#0e410e',
  PopupColor: '#2c4e2c',
  SelectColor: 'gray',
  ProgressColor: 'lime',
  DisabledColor: '#666666',
  OutlineColor: 'white',
}

@Component({
  templateUrl: './flat-ui.component.html',
})
export class FlatUIExample implements OnInit, AfterViewInit {

  selectable = new InteractiveObjects();;

  panelheight = 0.4;
  showimage = true;

  checked = false;
  textvalue = 'string';
  buttonvalue = 'Start'
  numbervalue = 0.1;
  get numbertext(): string { return this.numbervalue.toString(); }
  slidervalue = 0;
  get slidertext(): string { return this.slidervalue.toString(); }

  colorvalue = GlobalFlatUITheme.PanelColor

  svg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Three.js</title><path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z"/></svg>'

  private size = 0.5
  scale = [this.size, this.size, this.size] as NgtTriple;

  position = [0, 1, 0.2] as NgtTriple;

  list: Array<ListItem> = [];
  selectedtext!: string;

  panelcolor = GlobalFlatUITheme.PanelColor;
  texture!: Texture;
  side: Side = DoubleSide;

  constructor(
    private cameraService: CameraService,
    private loader: NgtLoader,
  ) {
    //this.cameraService.position = this.position;
    //this.cameraService.lookAt = [0, 0, -1.5];
    //this.cameraService.fov = 65;

    this.list.push({ text: 'Criminal Of Nightmares' })
    this.list.push({ text: 'Knight Of The Ancients and Scorcery' })
    this.list.push({ text: 'Pilots Without Duty' })
    this.list.push({ text: 'Horses With Pride' })
    this.list.push({ text: 'Swindlers And Men' })
    this.list.push({ text: 'Aliens And Mice' })
    this.list.push({ text: 'Planet Of The Forsaken' })
    this.list.push({ text: 'Rise With Pride' })
    this.list.push({ text: 'Becoming The Town' })
    this.list.push({ text: 'Battling In The River' })
    this.list.push({ text: 'Warrior Of Greatness' })
    this.list.push({ text: 'Enemy Without Courage' })
    this.list.push({ text: 'Humans Of Earth' })
    this.list.push({ text: 'Giants Of The Sea' })
    this.list.push({ text: 'Girls And Strangers' })
    this.list.push({ text: 'Rebels And Giants' })
    this.list.push({ text: 'Beginning Of The Frontline' })
    this.list.push({ text: 'Family Of Dread' })
    this.list.push({ text: 'Amusing The River' })
    this.list.push({ text: 'Bravery In The Swamp' })

    this.selectedtext = this.list[9].text;

    const s = this.loader.use(TextureLoader, 'assets/mandelbrot2.jpg').subscribe(next => {
      this.texture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }

  showlist = false;
  shownumpad = false;
  numpadposition = new Vector3();
  numpadrotation = new Euler();

  opennumpad(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.numpadposition);
    this.numpadposition.y -= 0.35;
    this.numpadposition.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.numpadrotation.setFromQuaternion(quat);

    this.shownumpad = true;
  }

  input?: UIInput;

  changeinput(input?: UIInput) {
    if (this.input && this.input != input)
      this.input.inputopen = false;
    this.input = input;
  }


  showkeyboard = false;
  keyboardposition = new Vector3();
  keyboardrotation = new Euler();

  openkeyboard(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.keyboardposition);
    this.keyboardposition.x += 0.01;
    this.keyboardposition.y -= 0.35;
    this.keyboardposition.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.keyboardrotation.setFromQuaternion(quat);

    this.showkeyboard = true;
  }

  showpicker = false;
  colorposition = new Vector3();
  colorrotation = new Euler();

  opencolor(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.colorposition);
    this.colorposition.x -= 0.02;
    this.colorposition.y -= 0.42;
    this.colorposition.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.colorrotation.setFromQuaternion(quat);

    this.showpicker = true;
  }

  colorpicked(color: string) {
    this.colorvalue = color;
    this.panelcolor = color;
  }

  clicked(event: any) {
    console.warn('clicked', event)
  }

  listposition = new Vector3();
  listrotation = new Euler();

  openlist(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.listposition);
    this.listposition.x -= 0.02;
    this.listposition.y -= 0.7;
    this.listposition.z += 0.1;


    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.listrotation.setFromQuaternion(quat);

    this.showlist = true;
  }

  listitem(item: string) {
    this.selectedtext = item;
    this.showlist = false
  }

  button(item: string) {
    console.warn('pressed', item)
  }

  pressed(keycode: string) {
    if (keycode == 'Back') {
      if (this.input) {
        if (this.input.text.length > 0) {
          this.input.text = this.input.text.slice(0, this.input.text.length - 1);
        }
      }
    }
    else if (keycode != 'Enter') {
      if (this.input)
        this.input.text += keycode;
    }
  }

  changed(event: boolean) {
    this.checked = event;
  }

  ngOnInit(): void {
    GlobalFlatUITheme.changeTheme(MatrixTheme);
    this.colorvalue = this.panelcolor = GlobalFlatUITheme.PanelColor;
  }

  ngAfterViewInit(): void {

    let count = 1
    let factor = 1;
    setInterval(() => {
      this.checked = !this.checked;

      this.textvalue = count.toString() + 's';
      this.numbervalue = count + 0.1;
      this.buttonvalue = this.checked ? 'Start' : 'Stop';
      this.slidervalue += factor;
      if (this.slidervalue < 1 || this.slidervalue > 9)
        factor = -factor;
      count++;
    }, 1000)
  }

}
