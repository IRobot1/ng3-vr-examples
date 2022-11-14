import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: './sankey.component.html',
})
export class SankeyExample implements OnInit {
  starty = 1;
  endy = 1.5;

  ngOnInit(): void {
    let sfactor = 1;
    let efactor = 1;

    setInterval(() => {
      // move up and down
      if (this.starty > 2 || this.starty < 0)
        sfactor = -sfactor;

      this.starty += Math.random() * 0.1 * sfactor;

      if (this.endy > 2 || this.endy < 0)
        efactor = -efactor;

      this.endy += Math.random() * 0.1 * efactor;
    }, 500)
  }
}
