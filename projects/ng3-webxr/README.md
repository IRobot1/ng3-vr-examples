Add VR or AR support to [@angular-three](https://github.com/nartc/angular-three) projects

## Enter VR

Add `webvr` to ngt-canvas to enable Web VR support
```html
<ngt-canvas webvr [camera]="{ fov: 55, position: [0, 2, 4]}">
```
Add vr-controller to add left and/or right controllers into a scene.  Index 0 is left controller, Index 1 is right controller.
```html
<vr-controller showcontroller trackedpointer [index]="1"></vr-controller>
```
Add directives to vr-controller to add behaviors depending on needs
* showcontroller - shows controller
* trackedpointer - shows ray to point at stuff
* teleport - teleport to new location on floor. Requires `[floor]` and `[marker]` 
```html
<vr-controller teleport showcontroller trackedpointer navhome 
               [marker]="left.instance.value" [floor]="floor.instance.value">
</vr-controller>
```

All behaviors can be enabled/disabled at runtime on either controller.  The allows behaviors to be switched between controllers if needed.
```html
<vr-controller [showcontroller]="enableshow" [trackedpointer]="enabletracking">
</vr-controller>

```

## Enter AR
Add `webar` to ngt-canvas to enable Web AR support
```html
<ngt-canvas webar [camera]="{ fov: 55, position: [0, 2, 4]}">
```
Add ar-controller to into the scene to add object interaction.  Index 0 is first finger controller, Index 1 is second finger controller.
```html
<ar-controller (tap)="tap($event)" [index]="1"></ar-controller>
```
```ts
tap(event: XRInputSource) {
  event.gamepad // x/y screen coordinates [-1 to 1, -1 to 1]
}
```
Add ar-gestures into the scene to detect doubletap, swipe and rotate gesures.
```html
<ar-gestures 
  (press)="press($event)"
  (tap)="tap($event)"
  (doubletap)="doubletap($event)"
  (tripletap)="tripletap($event)"
  (quadtap)="quadtap($event)"
  (swipe)="swipe($event)"
  (pinch)="pinch($event)"
  (rotate)="rotate($event)"
  (pan)="pan($event)">
</ar-gestures>
```
The following gesture events are available:

The controller position and matrixWorld are included

* press  - position: Vector3, matrixWorld: Matrix4 
* tap - position: Vector3, matrixWorld: Matrix4
* doubletap - position: Vector3, matrixWorld: Matrix4
* tripletap - position: Vector3, matrixWorld: Matrix4
* quadtap - position: Vector3, matrixWorld: Matrix4 

* swipe - direction is either 'up' or 'down'

* pinch - delta: pinch time, scale: pinch scale, initialise - true, start of pinch, false, end of pinch
* rotate - theta - angle in radians, initialise - true, start of rotate, false, end of rotate
* pan - delta: Vector3 distance, initialise - true, start of pan, false, end of pan

