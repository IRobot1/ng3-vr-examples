import { Component, OnInit, ViewChild } from "@angular/core";

import { BufferGeometry, Vector2 } from "three";

import { FlatUIDataGrid, InteractiveObjects } from "ng3-flat-ui";
import { Ng3GUI } from "ng3-gui";

// taken from https://material.angular.io/components/table/examples
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

@Component({
  templateUrl: './data-grid.component.html',
})
export class DataGridExample implements OnInit {
  @ViewChild('grid') grid!: FlatUIDataGrid;

  datasource = [
    { name: 'red', r: 255, g: 0, b: 0 },
    { name: 'green', r: 0, g: 255, b: 0 },
    { name: 'blue', r: 0, g: 0, b: 255 },
    { name: 'magenta', r: 170, g: 0, b: 255 },
    { name: 'gray', r: 50, g: 50, b: 50 },
    { name: 'aqua', r: 0, g: 255, b: 255 },
  ];

  selectable = new InteractiveObjects();;

  pivot = false;
  showheading = true;
  showfooter = true;
  headingheight = 0.2
  footerheight = 0.2
  showhlines = true;
  showvlines = true;
  showpaging = true;
  showfirstlast = true;
  showpagelabel = true;
  pagebuttonsize = 0.2
  vmargin = 0.02
  hmargin = 0.02
  rowheight = 0.25
  rowcount = 5;

  gui!: Ng3GUI
  makegui() {
    const gui = new Ng3GUI({ width: 300 });
    gui.settitle('Pivot')
    //gui.add(this, 'pivot').name('Pivot');
    gui.add(this, 'showheading').name('Show Heading');
    gui.add(this, 'showfooter').name('Show Footer');
    gui.add(this, 'headingheight', 0.1, 0.5).name('Heading Height');
    gui.add(this, 'footerheight', 0.1, 0.5).name('Footer Height');
    gui.add(this, 'showhlines').name('Show Horizontal Lines');
    gui.add(this, 'showvlines').name('Show Vertical Lines');

    gui.add(this, 'showpaging').name('Show Pagination').onChange(() => {
      if (this.showpaging)
        this.height += this.pagebuttonsize;
      else
        this.height -= this.pagebuttonsize;
    });
    gui.add(this, 'showfirstlast').name('Show Page First Last');
    gui.add(this, 'showpagelabel').name('Show Page Label');
    //gui.add(this, 'pagebuttonsize', 0.1, 0.4).name('Page Button Size');
    gui.add(this, 'vmargin', 0, 0.1, 0.01).name('Vertical Margin')
    gui.add(this, 'hmargin', 0, 0.1, 0.01).name('Horiztonal Margin')
    gui.add(this, 'rowcount', 1, 10, 1).name('Row Count')
    gui.add(this, 'rowheight', 0.1, 0.4).name('Row Height')

    this.gui = gui;
  }

  elements: Array<PeriodicElement> = []

  hline!: BufferGeometry;
  width = 0;
  widthchange(newvalue: number) {
    if (this.hline) this.hline.dispose();

    const points: Array<Vector2> = [
      new Vector2(),
      new Vector2(newvalue-this.hmargin*2, 0)
    ]
    this.hline = new BufferGeometry().setFromPoints(points);
    this.width = newvalue;
  }

  vline!: BufferGeometry;
  height = 0
  heightchange(newvalue: number) {
    if (this.vline) this.vline.dispose();

    const points: Array<Vector2> = [
      new Vector2(),
      new Vector2(0, -newvalue+this.vmargin*2)
    ]
    this.vline = new BufferGeometry().setFromPoints(points);
    this.height = newvalue;
    if (this.showpaging) this.height += this.pagebuttonsize
  }

  ngOnInit() {
    this.makegui();
    this.addremove();
    //this.update();
  }

  get totalweight(): string {
    let total = 0;
    this.elements.forEach(item => total += item.weight)
    return total.toFixed(2);
  }

  update() {
    const data: PeriodicElement = { name: '', description: '', weight: 0, symbol: '', position: 0 };
    this.elements.push(data);
    let index = 0;

    setInterval(() => {
      const next = this.xelements[index];
      data.name = next.name;
      data.symbol = next.symbol;
      data.weight = next.weight;
      data.description = next.description;

      index++;
      if (index == this.xelements.length)
        index = 0;
    }, 1000)

  }

  addremove() {
    let mode = true; // true - add, false - remove
    let duration = 20;
    let index = 0;

    // alternate between adding and remove items
    setInterval(() => {
      if (mode) {
        if (index == this.xelements.length) {
          this.elements.length = 0;
          index = 0;
        }
        this.elements.push(this.xelements[index]);
        index++;
      }
      else {
        if (index == 0) {
          index = this.xelements.length;
        }
        this.elements = this.xelements.filter((item, i) => i < index);
        index--;
      }
      this.grid.refresh();

      duration--;
      if (duration == 0) {
        mode = !mode;
        duration = 20;
        this.elements.length = 0;
        index = 0;
      }
    }, 1000)
  }

  // taken from https://material.angular.io/components/table/examples

  xelements: Array<PeriodicElement> = [
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
    },
    {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      description: `Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group in the periodic table. Its boiling point is the lowest among all the elements.`,
    },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal. Under standard conditions, it is the lightest metal and the lightest solid element.`,
    },
    {
      position: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
      description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei that have collided with cosmic rays.`,
    },
    {
      position: 5,
      name: 'Boron',
      weight: 10.811,
      symbol: 'B',
      description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a low-abundance element in the Solar system and in the Earth's crust.`,
    },
    {
      position: 6,
      name: 'Carbon',
      weight: 12.0107,
      symbol: 'C',
      description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds. It belongs to group 14 of the periodic table.`,
    },
    {
      position: 7,
      name: 'Nitrogen',
      weight: 14.0067,
      symbol: 'N',
      description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
    },
    {
      position: 8,
      name: 'Oxygen',
      weight: 15.9994,
      symbol: 'O',
      description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing agent that readily forms oxides with most elements as well as with other compounds.`,
    },
    {
      position: 9,
      name: 'Fluorine',
      weight: 18.9984,
      symbol: 'F',
      description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.`,
    },
    {
      position: 10,
      name: 'Neon',
      weight: 20.1797,
      symbol: 'Ne',
      description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas. Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about two-thirds the density of air.`,
    },
  ];
}
