import { Component } from "@angular/core";

import { Box3, Group, Mesh, Scene, Vector3 } from "three";
import { PLYLoader, PLYExporter } from 'three-stdlib';
import { NgtLoader } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";
import { FileSelected } from "ng3-file-list";
import { FileData } from "ngx-cloud-storage-types";

import { VirtualDrive } from "./virtual-drive";
import { BufferGeometry } from "three";

import { rootfolder } from "./folder-data";

@Component({
  templateUrl: './file-browser.component.html',
})
export class FileBrowserExample {
  virtual = new VirtualDrive(rootfolder);
  filters = [
    { name: 'GLTF Models', filter: 'glb,gltf' },
    { name: 'PLY Models', filter: 'ply' },
  ]
  selectable = new InteractiveObjects();

  showmodel = false;
  url!: string;
  scene!: Group;

  constructor(
    private loader: NgtLoader,
  ) {
    console.warn(new Date().toISOString())
  }

  loaded(scene: Scene) {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    box.getSize(size);
    this.scene.scale.setScalar(1 / size.length());
  }

  private loadGLTF(downloadUrl: string) {
    this.showmodel = false;
    this.url = downloadUrl;
  }

  geometry!: BufferGeometry;
  model!: Mesh;

  private loadPLY(downloadUrl: string) {
    const s = this.loader.use(PLYLoader, downloadUrl).subscribe(next => {
      next.computeBoundingBox();
      const box = next.boundingBox;

      const size = new Vector3(1, 1, 1)
      if (box) box.getSize(size);

      next.center();

      this.model.scale.setScalar(1 / size.length());

      if (this.model.geometry) this.model.geometry.dispose();
      this.model.geometry = next;
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
