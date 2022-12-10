import { Component, OnInit } from "@angular/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "ng3-gui";
import { PaginationParams, Photo } from "pexels";
import { CameraService } from "../../app/camera.service";
import { SimpleIconService } from "../svg/simple-icons-data";

import { PexelOrientation, PexelsService } from "./pexels.service";

import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: './pexels-photo.component.html',
  providers: [PexelsService, CookieService]
})
export class PexelsPhotoExample implements OnInit {
  apikey = ''
  enterapikey = false;

  guikey!: Ng3GUI;
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
  sizes = ['medium', 'original', 'large2x', 'large', 'small', 'tiny'];

  params = {
    query: 'Cats',
    orientation: 'landscape',
    color: '',
    size: 'medium',

    page: 1,
    per_page: 1
  }

  constructor(
    private pexels: PexelsService,
    private cameraman: CameraService,
    private icons: SimpleIconService,
    private cookie: CookieService,
  ) {
    this.cameraman.position = [0, 0, 1];
    this.cameraman.fov = 90;

    this.apikey = this.cookie.get('apikey');

    if (!this.apikey) {
      this.warning = 'Pexels API key is required. Join https://www.pexels.com/ to get a key.';
      console.warn(this.warning);
      this.enterapikey = true
      return;
    }

    pexels.connect(this.apikey);
    this.random();
  }

  updatePhoto(photo: Photo) {
    this.url = (photo.src as any)[this.params.size];
    this.title = photo.photographer;
    this.subtitle = photo.alt ?? '';
    console.log(this.title, this.subtitle);
  }

  private dosearch() {
    this.pexels.searchPhotos(this.params).then(next => {
      this.updatePhoto(next.photos[0])
    });
  }

  search() {
    if (!this.apikey) return;

    this.params.page = 1;
    this.dosearch();
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

  next() {
    if (!this.apikey) return;

    this.params.page++;
    this.dosearch();
  }

  prev() {
    if (!this.apikey) return;

    if (this.params.page > 1) {
      this.params.page--;
      this.dosearch();
    }
  }

  ngOnInit(): void {
    let gui = new Ng3GUI({ width: 300 });
    gui.title = 'Pexel API'
    gui.add(this, 'apikey').name('Paste API Key').onFinishChange(next => {
      console.log(next + 'saved as cookie');
      this.cookie.set('apikey', next);
      this.apikey = next;

      this.pexels.connect(this.apikey);
      this.random();

      this.enterapikey = false;
    });

    this.guikey = gui;


    gui = new Ng3GUI({ width: 300 });
    gui.title = 'Photo Query Parameters'
    gui.add(this.params, 'query').name('Topic');
    gui.add(this.params, 'query', this.topics).name('Topics');
    gui.add(this.params, 'size', this.sizes).name('Size');
    gui.add(this.params, 'orientation', this.orientations).name('Orientation')
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
    gui.add(this, 'next').name('Next');
    gui.add(this, 'prev').name('Previous');
    this.gui1 = gui;

    gui = new Ng3GUI({ width: 200 });
    gui.title = 'Curated and Random Photo'
    gui.add(this, 'curated').name('Latest');
    gui.add(this, 'random').name('Random');

    this.gui2 = gui;

    const s = this.icons.loadIcons().subscribe(all => {
      const icon = all.find(x => x.title == 'Pexels')
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
