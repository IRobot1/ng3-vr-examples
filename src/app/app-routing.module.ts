import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { DrumstickExample } from '../examples/drumstick/drumstick.component';
import { HandInputExample } from '../examples/hand/hand.component';
import { InspectExample } from '../examples/inspect/inspect.component';
import { JoystickExample } from '../examples/joystick/joystick.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Room1Example } from '../examples/room1/room1.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { TouchpadExample } from '../examples/touchpad/touchpad.component';
import { BehaviorsExample } from '../examples/behaviors/behaviors.component';
import { StudioExample } from '../examples/studio/studio.component';
import { PaintExample } from '../examples/paint/paint.component';
import { HTMLGUIExample } from '../examples/htmlgui/htmlgui.component';
import { ScaleExample } from '../examples/scale/scale.component';
import { ButtonsExample } from '../examples/buttons/buttons.component';
import { MorphWallExample } from '../examples/morphwall/morphwall.component';
import { SpirographExample } from '../examples/spriograph/spirograph.component';
import { ArtificialLifeExample } from '../examples/artificial-life/artificial-life.component';
import { SVGExample } from '../examples/svg/svg.component';
import { ForceLayoutExample } from '../examples/force-layout/force-layout.component';
import { GraphExample } from '../examples/graph/graph.component';
import { CollisionsExample } from '../examples/collisions/collisions.component';
import { FlatUIExample } from '../examples/flat-ui/flat-ui.component';
import { ThreeGUIExample } from '../examples/three-gui/three-gui.component';
import { LoadingExample } from '../examples/loading/loading.component';
import { StatsExample } from '../examples/stats/stats.component';
import { DataGridExample } from '../examples/data-grid/data-grid.component';
import { ListsExample } from '../examples/lists/lists.component';
import { KanbanExample } from '../examples/kanban/kanban.component';
import { ActionsExample } from '../examples/actons/actions.component';
import { EmptyExample } from '../examples/empty/empty.component';
import { JdenticonExample } from '../examples/jdenticon/jdenticon.component';
import { DicebearExample } from '../examples/dicebear/dicebear.component';
import { PexelsPhotoExample } from '../examples/pexels-photo/pexels-photo.component';
import { PathEditorExample } from '../examples/path-editor/path-editor.component';
import { PexelsVideoExample } from '../examples/pexels-video/pexels-video.component';
import { ShapewareExample } from '../examples/shapeware/shapeware.component';
import { FileBrowserExample } from '../examples/file-browser/file-browser.component';
import { DataVisualsExample } from '../examples/data-visuals/data-visuals.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewer', component: HomeComponent },
  { path: 'empty', component: EmptyExample },
  { path: 'ballshooter', component: BallshooterExample },
  { path: 'dragging', component: DraggingExample },
  { path: 'handinput', component: HandInputExample },
  { path: 'teleport', component: TeleportExample },
  { path: 'bat', component: BatExample },
  { path: 'inspect', component: InspectExample },
  { path: 'drumstick', component: DrumstickExample },
  { path: 'touchpad', component: TouchpadExample },
  { path: 'joystick', component: JoystickExample },
  { path: 'behaviors', component: BehaviorsExample },
  { path: 'room1', component: Room1Example },
  { path: 'studio', component: StudioExample },
  { path: 'paint', component: PaintExample },
  { path: 'htmlgui', component: HTMLGUIExample },
  { path: 'scale', component: ScaleExample },
  { path: 'buttons', component: ButtonsExample },
  { path: 'morphwall', component: MorphWallExample },
  { path: 'forcelayout', component: ForceLayoutExample },
  { path: 'network', component: ForceLayoutExample },
  { path: 'spirograph', component: SpirographExample },
  { path: 'artlife', component: ArtificialLifeExample },
  { path: 'svg', component: SVGExample },
  { path: 'graph', component: GraphExample },
  { path: 'collisions', component: CollisionsExample },
  { path: 'flat-ui', component: FlatUIExample },
  { path: 'three-gui', component: ThreeGUIExample },
  { path: 'loading', component: LoadingExample },
  { path: 'stats', component: StatsExample },
  { path: 'datagrid', component: DataGridExample },
  { path: 'lists', component: ListsExample },
  { path: 'kanban', component: KanbanExample },
  { path: 'actions', component: ActionsExample },
  { path: 'jdenticon', component: JdenticonExample },
  { path: 'dicebear', component: DicebearExample },
  { path: 'pexelsphoto', component: PexelsPhotoExample },
  { path: 'pexelsvideo', component: PexelsVideoExample },
  { path: 'patheditor', component: PathEditorExample },
  { path: 'shapeware-shapes', component: ShapewareExample },
  { path: 'file-browser', component: FileBrowserExample },
  { path: 'charts', component: DataVisualsExample },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
