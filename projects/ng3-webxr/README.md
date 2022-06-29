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
Add ar-controller to into the scene to add object interaction
```html
<ar-controller></ar-controller>
```
