import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Group, Line, Material, Mesh, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";

import { BufferGeometryUtils } from "..//BufferGeometryUtils";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-icon-button',
  exportAs: 'flatUIIconButton',
  templateUrl: './icon-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIIconButton extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    if (this.mesh)
      this.setButtonColor();
  }


  private _width = 0.1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _buttonmaterial!: Material
  @Input()
  get buttonmaterial(): Material {
    if (this._buttonmaterial) return this._buttonmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set buttonmaterial(newvalue: Material) {
    this._buttonmaterial = newvalue;
  }

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }

  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
  }


  private _iconmaterial!: Material
  @Input()
  get iconmaterial(): Material {
    if (this._iconmaterial) return this._iconmaterial;
    return GlobalFlatUITheme.IconMaterial;
  }
  set iconmaterial(newvalue: Material) {
    this._iconmaterial = newvalue;
  }

  @Input() selectable?: InteractiveObjects;

  @Output() pressed = new EventEmitter<void>();

  @Input() geometry!: BufferGeometry;
  protected icongeometry!: BufferGeometry;

  protected outline!: BufferGeometry; // outline material

  protected svgscale!: Vector3;

  constructor(private cd: ChangeDetectorRef) { super() }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
  }

  createButtonGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, 0.1, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  setButtonColor() {
    if (this.enabled) {
      this.mesh.material = this.buttonmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.buttonmaterial?.dispose();
    this.iconmaterial?.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', () => { this.doclick() })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
    this.setButtonColor();
  }


  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclick();
  }

  clicking = false;
  private doclick() {
    if (!this.enabled || !this.visible) return;

    this.mesh.scale.addScalar(-0.1);
    this.line.scale.addScalar(-0.1);
    this.clicking = true;

    const timer = setTimeout(() => {
      this.mesh.scale.addScalar(0.1);
      this.line.scale.addScalar(0.1);

      this.pressed.next();

      clearTimeout(timer);
      this.clicking = false;
    }, 100);
  }

  isover = false;
  over() {
    if (this.clicking || this.isover || !this.enabled) return;
    this.line.visible = true;
    this.isover = true;
  }
  out() {
    this.line.visible = false;
    this.isover = false;
  }

  private _url!: string;
  @Input()
  get url(): string { return this._url }
  set url(newvalue: string) {
    this._url = newvalue;
    if (newvalue) {
      this.loaded = false;
      this.load();
    }
  }
  @Input() set svg(text: string) {
    this.loaded = false;
    if (text) {
      this.zone.run(() => {
        this.process(this.loader.parse(text));
        this.loaded = true;
      })
    }
  }

  loaded = false;

  private group = new Group();
  private loader = new SVGLoader();


  private load(): void {
    this.loader.load(this._url, (data: SVGResult) => {
      this.process(data);
      this.loaded = true;
      this.cd.detectChanges(); // force change detection to render icon
    });
  }

  private process(data: SVGResult) {
    const paths = data.paths;

    // cleanup last loaded group of mesh geometries
    this.group.children.forEach(child => {
      (child as Mesh).geometry.dispose();
      this.group.remove(child);
    });
    this.group.children.length = 0;

    const geometries: Array<BufferGeometry> = [];

    for (let i = 0; i < paths.length; i++) {

      const path = paths[i];


      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        geometries.push(new ShapeGeometry(shape));

      }
    }

    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    if (geometry) {
      geometry.center();

      const size = new Vector3();
      geometry.boundingBox?.getSize(size);
      size.z = 1;
      this.svgscale = new Vector3(this.width * 0.8, -this.width * 0.8, 1).divide(size);

      this.icongeometry = geometry;
    }
  }

}
