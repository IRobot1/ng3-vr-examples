import { AfterViewInit, Component, Input } from "@angular/core";

import { Camera, Mesh, Texture, WebGLRenderTarget } from "three";

import { NgtRenderState, NgtStore, NgtTriple } from "@angular-three/core";


@Component({
  selector: 'camera-texture',
  templateUrl: './camera-texture.component.html'
})
export class CameraTextureComponent implements AfterViewInit {
  @Input() name = 'camera-texture'
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() camera!: Camera;

  private cameraTexture = new WebGLRenderTarget(512, 512);

  protected mesh!: Mesh;

  get texture(): Texture {
    return this.cameraTexture.texture;
  }

  constructor(
    private store: NgtStore,
  ) { }

  ngAfterViewInit(): void {
    const renderer = this.store.get(s => s.gl);
    this.cameraTexture.texture.encoding = renderer.outputEncoding;
  }

  tick(state: NgtRenderState) {
    if (!this.camera) return;

    const renderer = state.gl;

    // save the original camera properties
    const currentRenderTarget = renderer.getRenderTarget();
    const currentXrEnabled = renderer.xr.enabled;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    renderer.xr.enabled = false; // Avoid camera modification
    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

    // render the portal effect
    renderer.setRenderTarget(this.cameraTexture);
    renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897
    if (renderer.autoClear === false) renderer.clear();

    this.mesh.visible = false; // avoid GL_INVALID_OPERATION: Feedback loop formed between Framebuffer and active Texture.
    const scene = this.store.get(s => s.scene);
    renderer.render(scene, this.camera);
    this.mesh.visible = true;

    // restore the original rendering properties
    renderer.xr.enabled = currentXrEnabled;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
    renderer.setRenderTarget(currentRenderTarget);
  }
}
