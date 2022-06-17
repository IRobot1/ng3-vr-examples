import { NgtLoader } from "@angular-three/core";
import { Component } from "@angular/core";
import { RepeatWrapping, Texture, TextureLoader, Vector2 } from "three";

@Component({
  templateUrl: './room1.component.html',
})
export class Room1Example {
  roomwidth = 10;

  diffuse!: Texture;
  normal!: Texture;

  intensity = 0.5;

  constructor(private loader: NgtLoader) {
    const textures = ['assets/T_Wood_Pine_D.png', 'assets/T_Wood_Pine_N.png'];

    const s = this.loader.use(TextureLoader, textures).subscribe(next => {
      this.diffuse = next[0];
      this.diffuse.wrapS = RepeatWrapping;
      this.diffuse.wrapT = RepeatWrapping;
      this.diffuse.repeat = new Vector2(8, 8);
      this.normal = next[1];
      this.normal.wrapS = RepeatWrapping;
      this.normal.wrapT = RepeatWrapping;
      this.normal.repeat = new Vector2(8, 8);
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
}
