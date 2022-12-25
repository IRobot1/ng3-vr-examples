import { Component, OnInit } from "@angular/core";

import { LinearFilter, RGBAFormat, RGBFormat, VideoTexture } from "three";
import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "ng3-gui";


import { CameraService } from "../../app/camera.service";

import { CookieService } from 'ngx-cookie-service';
import { PexelOrientation, PexelsService } from "../pexels-photo/pexels.service";
import { Video } from "pexels";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  templateUrl: './pexels-video.component.html',
  providers: [PexelsService, CookieService]
})
export class PexelsVideoExample implements OnInit {
  apikey = ''
  enterapikey = false;

  guikey!: Ng3GUI;
  gui1!: Ng3GUI;
  gui2!: Ng3GUI;

  selectable = new InteractiveObjects();
  url!: string;
  title!: string;
  subtitle!: string;
  warning = 'Videos from https://www.pexels.com/';

  width = 4 / 3
  height = 1;

  orientations = ['landscape', 'portrait', 'square'];
  topics = ['cats', 'dogs', 'beach', 'tree', 'birds', 'sunset', 'snow', 'car'];
  sizes = ['medium', 'large', 'small'];

  search_params = {
    query: 'Cats',
    orientation: 'landscape',
    size: 'medium',

    page: 1,
    per_page: 1
  }

  popular_params = {
    id: 3230808,
    page: 1,
    per_page: 1
  }

  constructor(
    private pexels: PexelsService,
    private cameraman: CameraService,
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
  }

  updateVideo(video: Video) {
    const file = video.video_files[0];
    this.video.src = file.link;
    this.video.play();

    this.title = video.user.name;
    this.subtitle = video.user.url ?? '';
    console.log(this.title, ' - ', this.subtitle);
  }

  private dosearch() {
    if (!this.apikey) return;
    this.pexels.searchVideos(this.search_params).then(next => {
      this.updateVideo(next.videos[0])
    });
  }

  search() {
    this.search_params.page = 1;
    this.dosearch();
  }

  search_next() {
    this.search_params.page++;
    this.dosearch();
  }

  search_prev() {
    if (this.search_params.page > 1) {
      this.search_params.page--;
      this.dosearch();
    }
  }

  private dopopular() {
    if (!this.apikey) return;
    this.pexels.popularVideos(this.popular_params).then(next => {
      this.updateVideo(next.videos[0])
    });
  }

  popular() {
    this.popular_params.page = 1;
    this.dopopular();
  }

  popular_next() {
    this.popular_params.page++;
    this.dopopular();
  }

  popular_prev() {
    if (this.popular_params.page > 1) {
      this.popular_params.page--;
      this.dopopular();
    }
  }

  play_popular_id() {
    if (this.popular_params.id) {
      if (!this.apikey) return;
      this.pexels.showVideo(this.popular_params.id ).then(next => {
        this.updateVideo(next)
      });
    }
  }

  video!: HTMLVideoElement;
  videoTexture!: VideoTexture;

  ngOnInit(): void {
    // Create a video element and set the source
    var video = document.createElement('video');

    // crossorigin must be set to avoid error
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
    video.crossOrigin = "anonymous";
    video.loop = true;

    this.video = video;

    // Create a video texture from the video element
    this.videoTexture = new VideoTexture(video);
    this.videoTexture.minFilter = LinearFilter;
    this.videoTexture.magFilter = LinearFilter;
    this.videoTexture.format = RGBAFormat;

    let gui = new Ng3GUI({ width: 300 });
    gui.title = 'Pexel API'
    gui.add(this, 'apikey').name('Paste API Key').onFinishChange(next => {
      console.log('apikey saved as cookie');
      this.cookie.set('apikey', next, 30);
      this.apikey = next;

      this.pexels.connect(this.apikey);

      this.warning = 'Images from https://www.pexels.com/';
      this.enterapikey = false;
    });

    this.guikey = gui;


    gui = new Ng3GUI({ width: 300 });
    gui.title = 'Video Query Parameters'
    gui.add(this.search_params, 'query').name('Topic');
    gui.add(this.search_params, 'query', this.topics).name('Topics');
    gui.add(this.search_params, 'size', this.sizes).name('Size');
    gui.add(this.search_params, 'orientation', this.orientations).name('Orientation')
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

    gui.add(this, 'search').name('Search');
    gui.add(this, 'search_next').name('Next');
    gui.add(this, 'search_prev').name('Previous');
    gui.add(this.video, 'muted').name('Mute');
    gui.add(this.video, 'loop').name('Loop');
    this.gui1 = gui;

    gui = new Ng3GUI({ width: 210 });
    gui.add(this, 'popular').name('Popular');
    gui.add(this, 'popular_next').name('Next');
    gui.add(this, 'popular_prev').name('Previous');
    gui.add(this.popular_params, 'id').name('ID (with sound)');
    gui.add(this, 'play_popular_id').name('Play ID');

    this.gui2 = gui;
  }
}
