import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { InteractiveObjects, ListItem } from "ng3-flat-ui";

@Component({
  templateUrl: './lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListsExample implements OnInit {

  list: Array<ListItem> = [];
  selectedtext!: string;

  selectable = new InteractiveObjects();;

  images: Array<ListItem> = [
    { text: 'assets/mandelbrot1.jpg' },
    { text: 'assets/mandelbrot2.jpg' },
    { text: 'assets/mandelbrot3.jpg' },
  ]
  imagesize = 0.4;

  icons: Array<ListItem> = [
    { text: 'bug_report' },
    { text: 'coronavirus' },
    { text: 'local_florist' },
  ]
  fontsize = 0.4;

  ngOnInit(): void {
    setTimeout(() => {
      const list: Array<ListItem> = [];
      list.push({ text: 'Criminal Of Nightmares' })
      list.push({ text: 'Knight Of The Ancients and Scorcery' })
      list.push({ text: 'Pilots Without Duty' })
      list.push({ text: 'Horses With Pride' })
      list.push({ text: 'Swindlers And Men' })
      list.push({ text: 'Aliens And Mice' })
      list.push({ text: 'Planet Of The Forsaken' })
      list.push({ text: 'Rise With Pride' })
      list.push({ text: 'Becoming The Town' })
      list.push({ text: 'Battling In The River' })
      list.push({ text: 'Warrior Of Greatness' })
      list.push({ text: 'Enemy Without Courage' })
      list.push({ text: 'Humans Of Earth' })
      list.push({ text: 'Giants Of The Sea' })
      list.push({ text: 'Girls And Strangers' })
      list.push({ text: 'Rebels And Giants' })
      list.push({ text: 'Beginning Of The Frontline' })
      list.push({ text: 'Family Of Dread' })
      list.push({ text: 'Amusing The River' })
      list.push({ text: 'Bravery In The Swamp' })

      this.selectedtext = list[9].text;
      this.list = list;
    }, 2000)

  }

  selected(item: ListItem) {
    console.warn(item)
  }

}
