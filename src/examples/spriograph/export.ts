import { Object3D } from "three";

import { GLTFExporter, OBJExporter, PLYExporter } from "three-stdlib";

//
// code adapted from https://github.com/mrdoob/three.js/blob/master/examples/misc_exporter_gltf.html
//

export class Exporter {

  exportGLTF(input: any, filename = 'scene', binary = false) {

    const gltfExporter = new GLTFExporter();

    const options = {
      binary,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
    //  embedImages: true,
    //  forceIndices: true,
    //  forcePowerOfTwoTextures: true,
    //  includeCustomExtensions: true
    };
    gltfExporter.parse(
      input,
      (result: any) => {

        if (result instanceof ArrayBuffer) {
          this.saveArrayBuffer(result, filename + '.glb');

        } else {
          const output = JSON.stringify(result, null, 2);
          console.warn(output)
          this.saveString(output, filename + '.gltf');

        }

      },
      //(error: any) => {

      //  console.log('An error happened during parsing', error);

      //},
      options
    );

  }
  exportOBJ(input: Object3D, filename: string) {

    const exporter = new OBJExporter();

    const output = exporter.parse(input);

    this.saveString(output, filename + '.obj');
  }

  exportPLY(input: Object3D, filename: string) {

    const exporter = new PLYExporter();

    const output = <string>exporter.parse(input, undefined, {});

    this.saveString(output, filename + '.ply');
  }


  static link: any;

  constructor() {
    if (!Exporter.link) {
      Exporter.link = document.createElement('a');
      Exporter.link.style.display = 'none';
      document.body.appendChild(Exporter.link); // Firefox workaround, see #6594
    }
  }

  save(blob: any, filename: string) {

    Exporter.link.href = URL.createObjectURL(blob);
    Exporter.link.download = filename;
    Exporter.link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...

  }

  saveString(text: string, filename: string, mimetype = 'text/plain') {

    this.save(new Blob([text], { type: mimetype }), filename);

  }


  saveArrayBuffer(buffer: any, filename: string) {

    this.save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

  }
}
