import { NgtObject, NgtTriple } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'mesh-box-button',
  templateUrl: './mesh-box-button.component.html',
})
export class MeshBoxButtonComponent implements AfterViewInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() buttoncolor = 'blue';
  @Input() textcolor = 'white';

  @Input() text!: string

  public object!: NgtGroup;


  ngAfterViewInit(): void {
  }

}
