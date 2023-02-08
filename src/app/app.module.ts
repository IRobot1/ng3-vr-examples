import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { NgtCanvasModule, NgtObjectPassThrough, NgtRadianPipeModule } from '@angular-three/core';
import { NgtStatsModule } from '@angular-three/core/stats';

import { NgtBufferAttributeModule, NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtGridHelperModule, NgtPointLightHelperModule, NgtCameraHelperModule, NgtSpotLightHelperModule, NgtBoxHelperModule } from '@angular-three/core/helpers';

import { NgtAmbientLightModule, NgtDirectionalLightModule, NgtPointLightModule, NgtSpotLightModule } from '@angular-three/core/lights';

import { NgtInstancedMeshModule, NgtMeshModule } from '@angular-three/core/meshes';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtLineModule, NgtLineSegmentsModule } from '@angular-three/core/lines';
import { NgtPointsModule } from '@angular-three/core/points';

import { NgtBoxGeometryModule, NgtTubeGeometryModule, NgtBufferGeometryModule, NgtCircleGeometryModule, NgtConeGeometryModule, NgtCylinderGeometryModule, NgtIcosahedronGeometryModule, NgtPlaneGeometryModule, NgtSphereGeometryModule, NgtTorusGeometryModule, NgtTorusKnotGeometryModule, NgtRingGeometryModule, } from '@angular-three/core/geometries';

import { NgtLineBasicMaterialModule, NgtMeshBasicMaterialModule, NgtMeshStandardMaterialModule, NgtPointsMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'
import { NgtSobaTextModule } from '@angular-three/soba/abstractions'
import { NgtSobaSkyModule } from '@angular-three/soba/staging'

import { NgtCannonDebugModule, NgtPhysicsModule } from '@angular-three/cannon';

import { AppComponent } from './app.component';

import { LineRoomComponent } from '../components/line-room/line-room.componnet';

import { HomeComponent } from './home/home.component';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { HandInputExample } from '../examples/hand/hand.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Projectiles } from '../examples/physics-bat/projectiles/projectiles.component';
import { FloorComponent } from '../components/floor.component';
import { Target } from '../examples/physics-bat/target/target.component';
import { HandinputDirective } from '../examples/hand/handinput.directive';
import { DragDirective } from '../examples/dragging/drag.directive';
import { ShootDirective } from '../examples/ballshooter/shoot.directive';
import { BatDirective } from '../examples/physics-bat/bat.directive';
import { InspectExample } from '../examples/inspect/inspect.component';
import { GrabDirective } from '../examples/inspect/grab.directive';
import { InspectCube } from '../examples/inspect/inspect-cube.component';
import { DrumstickExample } from '../examples/drumstick/drumstick.component';
import { DrumKey } from '../examples/drumstick/key.component';
import { KeyboardComponent } from '../examples/drumstick/keyboard/keyboard.component';
import { TouchpadExample } from '../examples/touchpad/touchpad.component';
import { TouchMoveDirective } from '../examples/touchpad/touchmove.component';
import { JoystickExample } from '../examples/joystick/joystick.component';
import { JoystickhMoveDirective } from '../examples/joystick/joystickmove.directive';
import { Room1Example } from '../examples/room1/room1.component';
import { WallComponent } from '../components/wall.component';
import { ShowHandDirective } from '../examples/hand/showhand.directive';
import { PanelComponent } from './portal/panel/panel.component';
import { PortalComponent } from './portal/portal.component';
import { NavigateHomeDirective } from './portal/navhome.directive';
import { BehaviorsExample } from '../examples/behaviors/behaviors.component';

import { Ng3WebxrModule } from 'ng3-webxr';
import { StudioExample } from '../examples/studio/studio.component';
import { TVComponent } from '../examples/studio/tv/tv.component';
import { CameraTextureComponent } from '../examples/studio/camera-texture/camera-texture.component';
import { NgtPerspectiveCameraModule } from '@angular-three/core/cameras';
import { CameraModelComponent } from '../examples/studio/camera-model/camera-model.component';
import { PedestalComponent } from '../examples/studio/pedestal/pedestal.component';
import { GLTFodelComponent } from '../examples/studio/gltf-model/gltf-model.component';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { SpotlightModelComponent } from '../examples/studio/spotlight-model/spotlight-model.component';
import { PaintExample } from '../examples/paint/paint.component';
import { PaintBrushDirective } from '../examples/paint/paintbrush.directive';
import { HTMLGUIExample } from '../examples/htmlgui/htmlgui.component';
import { ScaleExample } from '../examples/scale/scale.component';
import { VRScaleComponent } from '../examples/scale/vr-scale.component';
import { MouseTouchInput } from '../examples/htmlgui/mouse-touch-input.component';
import { CameraManagerDirective } from './camerman.directive';
import { HandGestureDirective } from '../examples/hand/hand-guesture.directive';
import { ButtonsExample } from '../examples/buttons/buttons.component';
import { MeshBoxButtonComponent } from '../examples/buttons/mesh-box-button/mesh-box-button.component';
import { AnimateClickDirective } from '../examples/buttons/animate-click.directive';
import { SelectDirective } from '../examples/buttons/select.directive';
import { MorphWallExample } from '../examples/morphwall/morphwall.component';
import { ImageWallComponent } from '../examples/morphwall/image-wall/image-wall.component';
import { DrawRangeComponent } from '../art/drawrange/drawrange.component';
import { SpirographExample } from '../examples/spriograph/spirograph.component';
import { TwoArmSpiroComponent } from '../examples/spriograph/two-arm-spiro/two-arm-spiro.component';
import { SpiroMeshComponent } from '../examples/spriograph/spiro-mesh/spiro-mesh.component';
import { ArtificialLifeExample } from '../examples/artificial-life/artificial-life.component';
import { SVGExample } from '../examples/svg/svg.component';
import { SVGIconComponent } from '../examples/svg/svg-icon/svg-icon.component';
import { SpiralCircleComponent } from '../art/spiralcircle/spiralcircle.component';
import { WallClockComponent } from '../art/wall-clock/wall-clock.component';
import { SquareScaleComponent } from '../art/square-scale/square-scale.component';
import { CircleScaleComponent } from '../art/circle-scale/circle-scale.component';
import { DoubleHelixComponent } from '../art/double-helix/double-helix.component';
import { SquareShiftComponent } from '../art/square-shift/square-shift.component';
import { SpiralLineComponent } from '../art/spiral-line/spiral-line.component';
import { MonopolyBoardComponent } from '../art/monopoly-board/monopoly-board.component';
import { ForceLayoutExample } from '../examples/force-layout/force-layout.component';
import { ForceLayoutComponent } from '../examples/force-layout/force-layout-diagram/force-layout-diagram.component';
import { GraphExample } from '../examples/graph/graph.component';
import { DirectedGraphComponent } from '../examples/graph/directed-graph.component.ts/directed-graph.component';
import { CollisionsExample } from '../examples/collisions/collisions.component';
import { TouchDirective } from '../examples/collisions/touch.directive';
import { PlanetComponent } from '../components/planet/planet.component';
import { CollisionDirective } from '../examples/collisions/collision.directive';
import { RotatingSquaresComponent } from '../art/rotating-squares/rotating-squares.component';
import { FlatUIExample } from '../examples/flat-ui/flat-ui.component';
import { ThreeGUIExample } from '../examples/three-gui/three-gui.component';
import { LoadingExample } from '../examples/loading/loading.component';
import { SpokesLoadingComponent } from '../examples/loading/spokes/spokes.component';

import { Ng3FlatUiModule } from 'ng3-flat-ui';
import { Ng3GuiModule } from '../../projects/ng3-gui/src/public-api';
import { StatsExample } from '../examples/stats/stats.component';
import { FlatUIStatsComponent } from '../examples/stats/stats/stats.component';
import { FlatUIStatsPanelComponent } from '../examples/stats/stats-panel/stats-panel.component';
import { VROrbitDirective } from '../app/vrorbit.directive';
import { DataGridExample } from '../examples/data-grid/data-grid.component';
import { ListsExample } from '../examples/lists/lists.component';
import { KanbanExample } from '../examples/kanban/kanban.component';
import { ActionsExample } from '../examples/actons/actions.component';
import { EmptyExample } from '../examples/empty/empty.component';
import { JdenticonExample } from '../examples/jdenticon/jdenticon.component';
import { DicebearExample } from '../examples/dicebear/dicebear.component';
import { DiceBearAvatarComponent } from '../examples/dicebear/dicebear-avatar.component';
import { PexelsPhotoExample } from '../examples/pexels-photo/pexels-photo.component';
import { PathEditorExample } from '../examples/path-editor/path-editor.component';
import { FlatUIDragPlane } from '../examples/path-editor/drag-plane/drag-plane.component';
import { PathCommandList } from '../examples/path-editor/command-list/command-list.component';
import { PathCommandItem } from '../examples/path-editor/command-item/command-item.component';
import { PathPointComponent } from '../examples/path-editor/path-point/path-point.component';
import { PexelsVideoExample } from '../examples/pexels-video/pexels-video.component';
import { ShapewareExample } from '../examples/shapeware/shapeware.component';
import { ControlShapeComponent } from '../examples/shapeware/control/control.component';
import { StatementShapeComponent } from '../examples/shapeware/statement/statement.component';
import { EventShapeComponent } from '../examples/shapeware/event/event.component';
import { ExpressionShapeComponent } from '../examples/shapeware/expression/expression.component';
import { ConditionShapeComponent } from '../examples/shapeware/condition/condition.component';
import { PictureFrameShapeComponent } from '../art/picture-frame/picture-frame.component';
import { FileBrowserExample } from '../examples/file-browser/file-browser.component';

import { NgxCloudStorageTypesModule } from 'ngx-cloud-storage-types';
import { Ng3FileListModule } from 'ng3-file-list';
import { DataVisualsExample } from '../examples/data-visuals/data-visuals.component';
import { ColumnChart } from '../examples/data-visuals/column-chart/column-chart.component';
import { ChartColumnData } from '../examples/data-visuals/column-data/column-data.component';
import { ChartCallout } from '../examples/data-visuals/chart-callout/chart-callout.component';
import { ChartUnderline } from '../examples/data-visuals/chart-underline/chart-underline.component';
import { ChartGrid } from '../examples/data-visuals/chart-grid/chart-grid.component';
import { PieChart } from '../examples/data-visuals/pie-chart/pie-chart.component';
import { ChartPieData } from '../examples/data-visuals/pie-data/pie-data.component';
import { StackedBar } from '../examples/data-visuals/stacked-bar/stacked-bar.component';
import { ChartStackData } from '../examples/data-visuals/stack-data/stack-data.component';
import { LinePlot } from '../examples/data-visuals/line-plot/line-plot.component';
import { AreaPlot } from '../examples/data-visuals/area-plot/area-plot.component';
import { ChartAxis } from '../examples/data-visuals/chart-axis/chart-axis.component';
import { ControlRoomExample } from '../examples/control-room/control-room.component';
import { BlockConsole } from '../examples/control-room/block-console/block-console.component';
import { Tablet } from '../examples/control-room/tablet/tablet.component';



@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    PortalComponent,
    PanelComponent,
    NavigateHomeDirective,
    VROrbitDirective,

    CameraManagerDirective,

    LineRoomComponent,
    FloorComponent,

    DrawRangeComponent,
    SpiralCircleComponent,
    WallClockComponent,
    SquareScaleComponent,
    CircleScaleComponent,
    DoubleHelixComponent,
    SquareShiftComponent,
    SpiralLineComponent,
    MonopolyBoardComponent,
    PlanetComponent,
    RotatingSquaresComponent,
    PictureFrameShapeComponent,

    EmptyExample,
    BallshooterExample,
    ShootDirective,

    DraggingExample,
    DragDirective,

    HandInputExample,
    ShowHandDirective,
    HandinputDirective,
    HandGestureDirective,

    TeleportExample,

    BatExample,
    Projectiles,
    Target,
    BatDirective,

    InspectExample,
    InspectCube,
    GrabDirective,

    DrumstickExample,
    DrumKey,
    KeyboardComponent,

    TouchpadExample,
    TouchMoveDirective,

    JoystickExample,
    JoystickhMoveDirective,

    BehaviorsExample,

    Room1Example,
    WallComponent,

    StudioExample,
    CameraTextureComponent,
    CameraModelComponent,
    TVComponent,
    PedestalComponent,
    GLTFodelComponent,
    SpotlightModelComponent,

    PaintExample,
    PaintBrushDirective,

    HTMLGUIExample,
    MouseTouchInput,

    ScaleExample,
    VRScaleComponent,

    ButtonsExample,
    SelectDirective,
    AnimateClickDirective,
    MeshBoxButtonComponent,

    MorphWallExample,
    ImageWallComponent,

    ForceLayoutExample,
    ForceLayoutComponent,

    SpirographExample,
    TwoArmSpiroComponent,
    SpiroMeshComponent,

    ArtificialLifeExample,

    SVGExample,
    SVGIconComponent,

    GraphExample,
    DirectedGraphComponent,

    CollisionsExample,
    TouchDirective,
    CollisionDirective,

    FlatUIExample,

    ThreeGUIExample,

    LoadingExample,
    SpokesLoadingComponent,

    StatsExample,
    FlatUIStatsPanelComponent,
    FlatUIStatsComponent,

    DataGridExample,

    ListsExample,

    KanbanExample,

    ActionsExample,

    JdenticonExample,
    DicebearExample,
    DiceBearAvatarComponent,

    PexelsPhotoExample,
    PexelsVideoExample,

    PathEditorExample,
    PathCommandItem,
    PathCommandList,
    PathPointComponent,
    FlatUIDragPlane,

    ShapewareExample,
    ControlShapeComponent,
    StatementShapeComponent,
    EventShapeComponent,
    ExpressionShapeComponent,
    ConditionShapeComponent,

    FileBrowserExample,

    DataVisualsExample,
    ColumnChart,
    ChartColumnData,
    ChartCallout,
    ChartUnderline,
    ChartGrid,
    ChartAxis,
    PieChart,
    ChartPieData,
    StackedBar,
    ChartStackData,
    LinePlot,
    AreaPlot,

    ControlRoomExample,
    BlockConsole,
    Tablet,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    Ng3WebxrModule,
    Ng3FlatUiModule,
    Ng3GuiModule,
    Ng3FileListModule,
    NgxCloudStorageTypesModule,

    // core
    NgtCanvasModule,
    NgtPrimitiveModule,
    NgtColorAttributeModule,
    NgtBufferAttributeModule,
    NgtRadianPipeModule,
    NgtStatsModule,
    NgtObjectPassThrough,

    NgtPerspectiveCameraModule,
    NgtCameraHelperModule,

    NgtGridHelperModule,
    NgtBoxHelperModule,

    NgtAmbientLightModule,
    NgtDirectionalLightModule,

    NgtSpotLightModule,
    NgtSpotLightHelperModule,

    NgtPointLightModule,
    NgtPointLightHelperModule,

    NgtLineModule,
    NgtLineSegmentsModule,
    NgtPointsModule,
    NgtMeshModule,
    NgtInstancedMeshModule,
    NgtGroupModule,

    NgtBufferGeometryModule,
    NgtBoxGeometryModule,
    NgtSphereGeometryModule,
    NgtPlaneGeometryModule,
    NgtConeGeometryModule,
    NgtCylinderGeometryModule,
    NgtIcosahedronGeometryModule,
    NgtTorusGeometryModule,
    NgtTorusKnotGeometryModule,
    NgtCircleGeometryModule,
    NgtTubeGeometryModule,
    NgtRingGeometryModule,

    NgtMeshStandardMaterialModule,
    NgtLineBasicMaterialModule,
    NgtMeshBasicMaterialModule,
    NgtPointsMaterialModule,

    // soba
    NgtSobaOrbitControlsModule,
    NgtSobaTextModule,
    NgtSobaSkyModule,


    // cannon
    NgtPhysicsModule,
    NgtCannonDebugModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
