import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  templateUrl: './sankey.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SankeyExample implements OnInit {
  starty = 1;
  endy = 1.5;

  ngOnInit(): void {
    let sfactor = 1;
    let efactor = 1;

    setInterval(() => {
      // move up and down
      this.starty += Math.random() * 0.1 * sfactor;
      if (this.starty > 2)
        sfactor = -1;
      else if (this.starty < 0)
        sfactor = 1;

      this.endy += Math.random() * 0.1 * efactor;
      if (this.endy > 2)
        efactor = -1;
      else if (this.endy < 0)
        efactor = 1;

    }, 1000/30)
  }
}
