import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { FlatUIInputService, FlatUITheme, GlobalFlatUITheme, InteractiveObjects, ListItem } from "ng3-flat-ui";
import { Ng3GUI } from "ng3-gui";

import { CameraService } from "../../app/camera.service";
import { Euler, Material, MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three";

interface ThemeColors {
  name: string,
  lightest: string,
  light: string,
  middle: string,
  dark: string,
  darkest: string,
}

// https://www.w3schools.com/colors/colors_schemes.asp

const Themes: Array<ThemeColors> = [
  { name: 'Dark', lightest: 'cornflowerblue', light: 'white', middle: 'gray', dark: '#333', darkest: 'black' },
  { name: 'Moonlight', lightest: '#7898A5', light: '#5A7A87', middle: 'cornflowerblue', dark: '#080B0C', darkest: '#0D1518' },
  { name: 'Green', lightest: '#EBF7E3', light: '#9BD770', middle: '#66B032', dark: '#375F1B', darkest: '#1B3409' },
  { name: 'Reverse Green', lightest: '#1B3409', light: '#375F1B', middle: '#66B032', dark: '#9BD770', darkest: '#162a14' },
  { name: 'Compound', lightest: '#F0F7D4', light: '#B2D732', middle: '#FE2712', dark: '#347B98', darkest: '#092834' },
  { name: 'Blue', lightest: '#DBE5FF', light: '#678FFE', middle: '#0247FE', dark: '#012998', darkest: '#091534' },
  { name: 'Purple', lightest: '#EFDDFD', light: '#A33AF2', middle: '#700CBC', dark: '#36065B', darkest: '#210934' },
  { name: 'Amber', lightest: '#FEF3DC', light: '#FDCD6D', middle: '#FBA90A', dark: '#9C6902', darkest: '#342609' },
  { name: 'Red', lightest: '#FFDEDB', light: '#FE8176', middle: '#FE2712', dark: '#A70F01', darkest: '#340D09' },
  { name: 'Cranberry', lightest: '#FBDFE6', light: '#EC6988', middle: '#D61A46', dark: '#7B0F28', darkest: '#340913' },
  { name: 'Pink', lightest: '#FDDEF3', light: '#F033B4', middle: '#AE0D7A', dark: '#510639', darkest: '#340926' },
  { name: 'Orange', lightest: '#FFE5DC', light: '#FE9772', middle: '#FD4D0C', dark: '#A22C02', darkest: '#341509' },
]

@Component({
  templateUrl: './flat-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlatUIInputService],
})
export class FlatUIExample implements OnInit, AfterViewInit {

  selectable = new InteractiveObjects();
  themegui!: Ng3GUI;

  controlwidth = 2;
  controlheight = 2;

  dragheight = 1.4

  tabcontentheight = 0.5
  tabcontentwidth = 1.3

  panelheight = 0.3;
  showimage = true;

  radiovalue = 0;
  checked = true;
  textvalue = 'string';
  buttonvalue = 'Start'
  numbervalue = 0.1;
  get numbertext(): string { return this.numbervalue.toString(); }
  slidervalue = 0;
  get slidertext(): string { return this.slidervalue.toString(); }

  colorvalue = GlobalFlatUITheme.PanelColor

  textareavalue = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry';

  svg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Three.js</title><path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z"/></svg>'

  private size = 1
  scale = [this.size, this.size, this.size] as NgtTriple;

  position = [0, 1, 0.2] as NgtTriple;

  list: Array<ListItem> = [];
  selectedtext!: string;

  panelcolor = GlobalFlatUITheme.PanelColor;

  images: Array<string> = [
    'assets/mandelbrot1.jpg',
    'assets/mandelbrot2.jpg',
    'assets/mandelbrot3.jpg',
  ]
  imageindex = 0;
  image = this.images[this.imageindex];


  constructor(
    private cameraService: CameraService,
    public input: FlatUIInputService,
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
  }

  nextimage() {
    this.image = this.images[++this.imageindex % this.images.length]
  }

  colorpicked(color: string) {
    this.colorvalue = color;
    GlobalFlatUITheme.PanelColor = color;
    GlobalFlatUITheme.notify();
  }

  radiochange(value: any) {
    //console.warn('radio group value', value);
  }

  clicked(event: any) {
    console.warn('clicked')
  }

  button(item: string) {
    console.warn('pressed', item)
  }

  changed(event: boolean) {
    this.checked = event;
  }

  popupposition = new Vector3();
  popuprotation = new Euler();
  popupscale = new Vector3(1, 1, 1);

  private popuptransform(object: Object3D) {
    object.getWorldPosition(this.popupposition);
    this.popupposition.y -= 0.35;
    this.popupposition.z += 0.2;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.popuprotation.setFromQuaternion(quat);

  }
  confirmobject!: Object3D;
  showconfirm = false;

  confirm() {
    this.popuptransform(this.confirmobject)
    this.showconfirm = true;
  }

  promptobject!: Object3D;
  showprompt = false;

  prompt() {
    this.popuptransform(this.promptobject)
    this.showprompt = true;
  }

  log(message: string) {
    console.log(message)
  }

  themename = '';

  ngOnInit(): void {
    this.colorvalue = this.panelcolor = GlobalFlatUITheme.PanelColor;

    const gui = new Ng3GUI({ width: 300 }).settitle('Theme Colors');
    gui.add(this, 'themename', Themes.map(item => item.name)).name('Themes').onChange(() => {
      const theme = Themes.find(item => item.name == this.themename);
      if (!theme) return;

      const newtheme: FlatUITheme = {
        LabelColor: theme.light,
        ButtonColor: theme.dark,
        NumberColor: theme.lightest,
        StringColor: theme.lightest,
        CheckColor: theme.lightest,
        SlideColor: theme.lightest,
        ToggleFalseColor: theme.middle,
        ToggleTrueColor: theme.lightest,
        IconColor: theme.lightest,
        PanelColor: theme.darkest,
        PopupColor: theme.darkest,
        SelectColor: theme.dark,
        ProgressColor: theme.lightest,
        DisabledColor: '#555555',
        OutlineColor: theme.lightest,
        ScaleColor: theme.lightest,
        ListSelectColor: theme.middle,
      }
      GlobalFlatUITheme.changeTheme(newtheme);
    });
    gui.addColor(GlobalFlatUITheme, 'LabelColor').onChange(() => {
      (GlobalFlatUITheme.LabelMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.LabelColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ButtonColor').onChange(() => {
      (GlobalFlatUITheme.ButtonMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ButtonColor);
    });
    gui.addColor(GlobalFlatUITheme, 'NumberColor').onChange(() => {
      (GlobalFlatUITheme.NumberMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.NumberColor);
    });
    gui.addColor(GlobalFlatUITheme, 'StringColor').onChange(() => {
      (GlobalFlatUITheme.StringMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.StringColor);
    });
    gui.addColor(GlobalFlatUITheme, 'CheckColor').onChange(() => {
      (GlobalFlatUITheme.CheckMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.CheckColor);
    });
    gui.addColor(GlobalFlatUITheme, 'SlideColor').onChange(() => {
      (GlobalFlatUITheme.SliderMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.SlideColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ToggleFalseColor').onChange(() => {
      (GlobalFlatUITheme.ToggleFalseMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ToggleFalseColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ToggleTrueColor').onChange(() => {
      (GlobalFlatUITheme.ToggleTrueMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ToggleTrueColor);
    });
    gui.addColor(GlobalFlatUITheme, 'IconColor').onChange(() => {
      (GlobalFlatUITheme.IconMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.IconColor);
    });
    gui.addColor(GlobalFlatUITheme, 'PanelColor').onChange(() => {
      (GlobalFlatUITheme.PanelMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.PanelColor);
      this.colorvalue = this.panelcolor = GlobalFlatUITheme.PanelColor;
    });
    gui.addColor(GlobalFlatUITheme, 'PopupColor').onChange(() => {
      (GlobalFlatUITheme.PopupMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.PopupColor);
    });
    gui.addColor(GlobalFlatUITheme, 'SelectColor').onChange(() => {
      (GlobalFlatUITheme.SelectMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.SelectColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ProgressColor').onChange(() => {
      (GlobalFlatUITheme.ProgressMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ProgressColor);
    });
    gui.addColor(GlobalFlatUITheme, 'DisabledColor').onChange(() => {
      (GlobalFlatUITheme.DisabledMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.DisabledColor);
    });
    gui.addColor(GlobalFlatUITheme, 'OutlineColor').onChange(() => {
      (GlobalFlatUITheme.OutlineMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.OutlineColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ScaleColor').onChange(() => {
      (GlobalFlatUITheme.ScaleMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ScaleColor);
    });
    gui.addColor(GlobalFlatUITheme, 'ListSelectColor').onChange(() => {
      (GlobalFlatUITheme.ListSelectMaterial as MeshBasicMaterial).color.setStyle(GlobalFlatUITheme.ListSelectColor);
    });
    this.themegui = gui;

  }

  ngAfterViewInit(): void {

    let count = 1
    let factor = 1;
    setInterval(() => {
      this.checked = !this.checked;
      this.radiovalue = ++this.radiovalue % 3;
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
