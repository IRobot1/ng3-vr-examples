import { Component } from "@angular/core";

import { Box3, Group, Scene, Vector3 } from "three";
import { PLYLoader, PLYExporter } from 'three-stdlib';
import { NgtLoader } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";
import { FileSelected } from "ng3-file-list";
import { FileData } from "ngx-cloud-storage-types";

import { VirtualDrive } from "./virtual-drive";
import { BufferGeometry } from "three";

@Component({
  templateUrl: './file-browser.component.html',
})
export class FileBrowserExample {
  private data: Array<FileData> = [
    {
      "isfolder": false,
      "name": "spiro1.ply",
      "id": "spiro1.ply",
      "extension": "ply",
      "lastmodified": Date.now().toString(),
      "size": "1 MB - ",
      "downloadurl": "assets/spiro1.ply"
    },
    {
      "isfolder": false,
      "name": "apple.gltf",
      "id": "apple.gltf",
      "extension": "gltf",
      "lastmodified": Date.now().toString(),
      "size": "3 KB - ",
      "downloadurl": "assets/food/apple.gltf"
    },
    {
      "isfolder": false,
      "name": "head.gltf",
      "id": "head.gltf",
      "extension": "gltf",
      "lastmodified": Date.now().toString(),
      "size": "3 KB - ",
      "downloadurl": "assets/head/statue.gltf"
    },
    {
      "isfolder": false,
      "name": "horse.gltf",
      "id": "horse.gltf",
      "extension": "gltf",
      "lastmodified": Date.now().toString(),
      "size": "6 KB - ",
      "downloadurl": "assets/horse/statue.gltf"
    },
    {
      "isfolder": false,
      "name": "LittlestTokyo.glb",
      "id": "LittlestTokyo.glb",
      "extension": "glb",
      "lastmodified": Date.now().toString(),
      "size": "3.9 MB - ",
      "downloadurl": "assets/LittlestTokyo.glb"
    }
  ]
  virtual = new VirtualDrive(this.data);
  filters = [
    { name: 'Models', filter: 'ply' }, 
    { name: 'Models', filter: 'glb,gltf' },
  ]
  selectable = new InteractiveObjects();

  showmodel = false;
  url!:string;
  scene!: Group;

  constructor(
    private loader: NgtLoader,
  ) { }

  loaded(scene: Scene) {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    box.getSize(size);
    this.scene.scale.setScalar(1 / size.length());
    //this.cd.detectChanges();
  }

  private loadGLTF(downloadUrl: string) {
    this.showmodel = false;
    this.url = downloadUrl;
  }

  geometry!: BufferGeometry;

  private loadPLY(downloadUrl: string) {
    const s = this.loader.use(PLYLoader, downloadUrl).subscribe(next => {
      next.center();
      //if (next.boundingBox)
      //  this.meshheight = (next.boundingBox.max.y - next.boundingBox.min.y) / 2;

      if (this.geometry) this.geometry.dispose();
      this.geometry = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }


  open(file: FileSelected) {
    console.warn('open', file.downloadUrl)
    
    switch (file.item.extension) {
      case 'ply':
        this.loadPLY(file.downloadUrl);
        this.showmodel = true
        break;
      case 'gltf':
      case 'glb':
        this.showmodel = false;
        this.loadGLTF(file.downloadUrl);
        break;
    }

  }

  log(type: string, data: FileData) {
    console.warn(type, data);
  }

}
