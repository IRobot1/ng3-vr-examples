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

import { NgtBoxGeometryModule, NgtTubeGeometryModule, NgtBufferGeometryModule, NgtCircleGeometryModule, NgtConeGeometryModule, NgtCylinderGeometryModule, NgtIcosahedronGeometryModule, NgtPlaneGeometryModule, NgtSphereGeometryModule, NgtTorusGeometryModule, NgtTorusKnotGeometryModule, NgtRingGeometryModule,  } from '@angular-three/core/geometries';

import { NgtLineBasicMaterialModule, NgtMeshBasicMaterialModule, NgtMeshStandardMaterialModule, NgtPointsMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'
import { NgtSobaTextModule } from '@angular-three/soba/abstractions'
import { NgtSobaSkyModule  } from '@angular-three/soba/staging'

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
import { GUIPointerDirective } from '../examples/htmlgui/guipointer.directive';
import { ScaleExample } from '../examples/scale/scale.component';
import { VRScaleComponent } from '../examples/scale/vr-scale.component';
import { MouseTouchInput } from '../examples/htmlgui/mouse-touch-input.component';
import { CameraManagerDirective } from './camerman.directive';
import { Ng3LilGUIComponent } from '../components/ng3-lil-gui/ng3-lil-gui.component';
import { HandGestureDirective } from '../examples/hand/hand-guesture.directive';
import { ButtonsExample } from '../examples/buttons/buttons.component';
import { MeshBoxButtonComponent } from '../examples/buttons/mesh-box-button/mesh-box-button.component';
import { AnimateClickDirective } from '../examples/buttons/animate-click.directive';
import { SelectDirective } from '../examples/buttons/select.directive';
import { MorphWallExample } from '../examples/morphwall/morphwall.component';
import { ImageWallComponent } from '../examples/morphwall/image-wall/image-wall.component';
import { DrawRangeComponent } from '../art/drawrange/drawrange.component';
import { BoxLineGeometryComponent } from '../components/box-line-geometry.component';
import { RoundedBoxGeometryComponent } from '../components/rounded-box-geometry.component';
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
import { Ng3GUIComponent } from '../examples/three-gui/gui/gui.component';
import { Ng3GUIItemComponent } from '../examples/three-gui/gui-item/gui-item.component';
import { Ng3GUIFolderComponent } from '../examples/three-gui/gui-folder/gui-folder.component';
import { LoadingExample } from '../examples/loading/loading.component';
import { SpokesLoadingComponent } from '../examples/loading/spokes/spokes.component';

import { Ng3FlatUiModule } from 'ng3-flat-ui';



@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    PortalComponent,
    PanelComponent,
    NavigateHomeDirective,

    CameraManagerDirective,

    LineRoomComponent,
    FloorComponent,

    DrawRangeComponent,
    BoxLineGeometryComponent,
    RoundedBoxGeometryComponent,
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
    Ng3LilGUIComponent,
    GUIPointerDirective,
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
    Ng3GUIComponent,
    Ng3GUIItemComponent,
    Ng3GUIFolderComponent,

    LoadingExample,
    SpokesLoadingComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    Ng3WebxrModule,
    Ng3FlatUiModule,

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

    // ngraph
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
