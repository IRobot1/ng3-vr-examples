import { ChangeDetectionStrategy, Component, Input, ViewChild } from "@angular/core";

import { MathUtils, Mesh, Object3D } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme, InteractiveObjects } from "ng3-flat-ui";

import { FlatUIStatsPanelComponent } from "../stats-panel/stats-panel.component";

@Component({
  selector: 'flat-ui-stats',
  exportAs: 'flatUIStats',
  templateUrl: './stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUIStatsComponent extends NgtObjectProps<Mesh> {
  @Input() selectable?: InteractiveObjects;

  @ViewChild('ms') msPanel!: FlatUIStatsPanelComponent;
  @ViewChild('fps') fpsPanel!: FlatUIStatsPanelComponent;
  @ViewChild('mem') memPanel!: FlatUIStatsPanelComponent;

  private _panel = 0;
  @Input()
  get panel(): number { return this._panel }
  set panel(newvalue: number) {
    this._panel = MathUtils.clamp(newvalue, 0, 2);
  }

  @Input() locked = false;

  protected width = 0.6;
  protected height = 0.45;
  protected panelmaterial = GlobalFlatUITheme.PanelMaterial;

  private beginTime = (performance || Date).now()
  private prevTime = this.beginTime
  private frames = 0;

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  mesh!: Mesh;
  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);
    mesh.addEventListener('click', (e: any) => { this.nextpanel(); e.stop = true });

    this.mesh = mesh;
  }

  nextpanel() {
    if (this.locked) return;
    this.panel = ++this.panel % 3;
  }

  clicked(object: Object3D, event: NgtEvent<MouseEvent>) {
    if (event.object != object) return;

    event.stopPropagation();

    this.nextpanel();
  }

  tick() {
    this.frames++;

    var time = (performance || Date).now();

    this.msPanel.addvalue(time - this.beginTime, 200);

    if (time >= this.prevTime + 1000) {

      this.fpsPanel.addvalue((this.frames * 1000) / (time - this.prevTime), 100);

      this.prevTime = time;
      this.frames = 0;

      const memory = (performance as any).memory;
      if (memory) {
        this.memPanel.addvalue(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
      }
    }

    this.beginTime = time;
  }

}
