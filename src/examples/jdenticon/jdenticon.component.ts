import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable, Subscription, timer } from "rxjs";

import { CanvasTexture, MathUtils, MeshBasicMaterial, sRGBEncoding } from "three";

import { updateCanvas, configure, toSvg } from 'jdenticon';

import { SimpleIconService, SVGData } from "../svg/simple-icons-data";


@Component({
  templateUrl: './jdenticon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JdenticonExample implements OnInit {
  material!: MeshBasicMaterial;
  title!: string;
  svg!: string;

  private timer: Observable<number> = timer(0, 10 * 1000);
  private subs = new Subscription();

  constructor(
    private icons: SimpleIconService,
  ) {
    const s = this.icons.loadIcons().subscribe(all => {
      this.subs.add(this.timer.subscribe(() => {
        this.refreshicons(all);
      }));
    },
      () => { },
      () => {
        s.unsubscribe();
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
  }


  private refreshicons(allsimpleicons: Array<SVGData>) {
    const index = MathUtils.randInt(0, allsimpleicons.length);
    const icon = allsimpleicons[index]
    if (icon) {
      this.title = icon.title;
      if (this.material) this.material.dispose();
      this.material = this.updateCanvas(icon.title);
      this.svg = this.updateSVG(icon.title);
    }
  }

  /**
 * Jdenticon
 * https://github.com/dmester/jdenticon
 */

  updateCanvas(hashOrValue: any): MeshBasicMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const context = canvas.getContext('2d');
    if (!context) return new MeshBasicMaterial({ color: 'black' });

    updateCanvas(canvas, hashOrValue);
    //configure({  });

    const texture = new CanvasTexture(canvas)
    texture.encoding = sRGBEncoding;

    return new MeshBasicMaterial({ map: texture, transparent: true });
  }

  updateSVG(hashOrValue: any): string {
    return toSvg(hashOrValue, 48);
  }
}
