import { Component, OnInit } from "@angular/core";

import { InteractiveObjects, ListItem } from "ng3-flat-ui";

@Component({
  templateUrl: './lists.component.html',
})
export class ListsExample implements OnInit {

  list: Array<ListItem> = [];
  selectedtext!: string;

  selectable = new InteractiveObjects();;

  ngOnInit(): void {

    this.list.push({ text: 'Criminal Of Nightmares' })
    this.list.push({ text: 'Knight Of The Ancients and Scorcery' })
    this.list.push({ text: 'Pilots Without Duty' })
    this.list.push({ text: 'Horses With Pride' })
    this.list.push({ text: 'Swindlers And Men' })
    this.list.push({ text: 'Aliens And Mice' })
    this.list.push({ text: 'Planet Of The Forsaken' })
    this.list.push({ text: 'Rise With Pride' })
    this.list.push({ text: 'Becoming The Town' })
    this.list.push({ text: 'Battling In The River' })
    this.list.push({ text: 'Warrior Of Greatness' })
    this.list.push({ text: 'Enemy Without Courage' })
    this.list.push({ text: 'Humans Of Earth' })
    this.list.push({ text: 'Giants Of The Sea' })
    this.list.push({ text: 'Girls And Strangers' })
    this.list.push({ text: 'Rebels And Giants' })
    this.list.push({ text: 'Beginning Of The Frontline' })
    this.list.push({ text: 'Family Of Dread' })
    this.list.push({ text: 'Amusing The River' })
    this.list.push({ text: 'Bravery In The Swamp' })

    this.selectedtext = this.list[9].text;

  }


}
