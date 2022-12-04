import { Component, OnInit } from "@angular/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "ng3-gui";
import { PaginationParams, Photo } from "pexels";
import { CameraService } from "../../app/camera.service";
import { SimpleIconService } from "../svg/simple-icons-data";

import { PexelOrientation, PexelsService } from "./pexels.service";


@Component({
  templateUrl: './pexels-photo.component.html',
  providers: [PexelsService]
})
export class PexelsPhotoExample implements OnInit {
  apikey = '';

  gui1!: Ng3GUI;
  gui2!: Ng3GUI;

  selectable = new InteractiveObjects();
  url!: string;
  title!: string;
  subtitle!: string;
  warning = 'Images from https://www.pexels.com/';

  svg!: string;
  svgcolor!: string;

  width = 4 / 3
  height = 1;

  orientations = ['landscape', 'portrait', 'square'];
  colors = ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'purple', 'pink', 'brown', 'black', 'gray', 'white'];
  topics = ['cats', 'dogs', 'beach', 'tree', 'birds', 'sunset', 'snow', 'car'];

  params = {
    query: 'Cats',
    orientation: 'landscape',
    color: '',

    size: 'small',
    per_page: 1
  }

  constructor(
    private pexels: PexelsService,
    private cameraman: CameraService,
    private icons: SimpleIconService,
  ) {
    this.cameraman.position = [0, 0, 1];
    this.cameraman.fov = 90;

    if (!this.apikey) {
      this.warning = 'Pexels API key is required. Join https://www.pexels.com/ to get a key.';
      console.warn(this.warning);
      return;
    }

    pexels.connect(this.apikey);

  }

  updatePhoto(photo: Photo) {
    this.url = photo.src.tiny;
    this.title = photo.photographer;
    this.subtitle = photo.alt ?? '';
    console.log(this.title, this.subtitle);
  }

  search() {
    if (!this.apikey) return;

    this.pexels.searchPhotos(this.params).then(next => {
      this.updatePhoto(next.photos[0])
    });
  }

  curated() {
    if (!this.apikey) return;

    this.pexels.curatedPhotos(this.params).then(next => {
      this.updatePhoto(next.photos[0])
    });
  }

  random() {
    if (!this.apikey) return;

    this.pexels.randomPhoto().then(next => {
      this.updatePhoto(next)
    });
  }

  ngOnInit(): void {
    let gui = new Ng3GUI({ width: 300 });
    gui.title = 'Photo Query Parameters'
    gui.add(this.params, 'query').name('Topic');
    gui.add(this.params, 'query', this.topics).name('Topics');
    gui.add(this.params, 'orientation', this.orientations ).name('Orientation')
      .onChange((orientation: PexelOrientation) => {
        switch (orientation) {
          case 'portrait':
            this.width = 1;
            this.height = 4 / 3;
            break;
          case 'landscape':
            this.width = 4 / 3;
            this.height = 1;
            break;
          case 'square':
            this.width = 1;
            this.height = 1;
            break;
        }
      });

    gui.add(this.params, 'color', this.colors).name('Color');
    gui.addColor(this.params, 'color').name('Hex Color');

    gui.add(this, 'search').name('Search');
    this.gui1 = gui;

    gui = new Ng3GUI({ width: 300 });
    gui.title = 'Curated and Random Photo'
    gui.add(this, 'curated').name('Latest');
    gui.add(this, 'random').name('Random');

    this.gui2 = gui;

    const s = this.icons.loadIcons().subscribe(all => {
      const icon = all.find(x => x.title == 'Pexels')
      console.warn(icon)
      if (icon) {
        this.svg = icon.svg;
        this.svgcolor = icon.color;
      }

    },
      () => { },
      () => {
        s.unsubscribe();
      });


  }
}
