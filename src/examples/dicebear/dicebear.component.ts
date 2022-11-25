import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { interval, Observable, Subscription } from "rxjs";

import { createAvatar } from '@dicebear/avatars';
import * as adventurer from '@dicebear/adventurer';
import * as adventurereutral from '@dicebear/adventurer-neutral';
import * as avataaars from '@dicebear/avatars-avataaars-sprites';
import * as bigears from '@dicebear/big-ears';
import * as bigearsneutral from '@dicebear/big-ears-neutral';
import * as bigsmile from '@dicebear/big-smile';
import * as bottts from '@dicebear/avatars-bottts-sprites';
//import * as croodles from '@dicebear/croodles';
import * as croodlesneutral from '@dicebear/croodles-neutral';
import * as identicon from '@dicebear/avatars-identicon-sprites';
//import * as initials from '@dicebear/avatars-initials-sprites';
import * as micah from '@dicebear/micah';
import * as miniavs from '@dicebear/miniavs';
import * as openpeeps from '@dicebear/open-peeps';
//import * as personas from '@dicebear/personas';
//import * as pixelart from '@dicebear/pixel-art';
//import * as pixelartneutral from '@dicebear/pixel-art-neutral';

import { uniqueNamesGenerator, names } from 'unique-names-generator';

interface DiceBearData {
  title: string;
  style: any;
  size: number;
  z: number;
  rotation: number;
  svg: string;
}

@Component({
  templateUrl: './dicebear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DicebearExample implements OnInit {
  title = 'anidivr';

  styles: Array<DiceBearData> = [
    { title: 'adventurer', style: adventurer, size: 762, z: 0.1, rotation: 0, svg: '' },
    { title: 'adventurereutral', style: adventurereutral, size: 400, z: 0.1, rotation: 0, svg: '' },
    { title: 'avataaars', style: avataaars, size: 280, z: 0.1, rotation: 0, svg: '' },
    { title: 'bigears', style: bigears, size: 440, z: 0.1, rotation: 0, svg: '' },
    { title: 'bigearsneutral', style: bigearsneutral, size: 210, z: 0.1, rotation: 0, svg: '' },
    { title: 'bigsmile', style: bigsmile, size: 480, z: 0.1, rotation: 0, svg: '' },
    // bottts sometimes renders incorrectly.  See console warning SVGLoader: Elliptic arc or ellipse rotation or skewing is not implemented.
    { title: 'bottts', style: bottts, size: 180, z: 0.1, rotation: 0, svg: '' },
    { title: 'croodlesneutral', style: croodlesneutral, size: 128, z: 0.1, rotation: 0, svg: '' },
    { title: 'identicon', style: identicon, size: 5, z: 0, rotation: 0, svg: '' },
    { title: 'advemicahnturer', style: micah, size: 360, z: 0.1, rotation: 0, svg: '' },
    { title: 'miniavs', style: miniavs, size: 64, z: 0.01, rotation: 0, svg: '' },
    { title: 'openpeeps', style: openpeeps, size: 704, z: 0.1, rotation: 0, svg: '' },

    // these do not render correctly due to overlapping geometry
    //{ title: 'croodles', style: croodles, size: 256, z: 0.1, rotation: 0, svg: '' },
    //{ style: initials, size: 1, z: 0.1 },
    //{ style: personas, size: 64, z: 0.1 },
    //{ style: pixelart, size: 20, z: 0.1 },
    //{ style: pixelartneutral, size: 14, z: 0.1 },
  ]

  private timer: Observable<number> = interval(10 * 1000);
  private subs = new Subscription();

  ngOnInit(): void {
    let angle = 360 / this.styles.length;

    this.styles.forEach((item, index) => {
      item.rotation = angle * index;
    });

    this.subs.add(this.timer.subscribe(() => {
      this.title = uniqueNamesGenerator({ dictionaries: [names, names], separator: ' ', length: 2 });
      this.updateAvatars(this.title);
      console.log(this.title)
    }));

    this.updateAvatars(this.title);
  }

  updateAvatars(seed: any) {
    this.styles.forEach(item => {
      item.svg = this.updateSVG(item.style, seed);
    });
  }

  updateSVG(style: any, seed: any): string {
    return createAvatar(style as any, { seed });
  }
}
