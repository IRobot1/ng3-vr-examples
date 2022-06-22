VR Examples for @angular-three

[DEMO here](https://ng3vr.z9.web.core.windows.net/)

Using Windows Mixed Reality the demo works perfectly.  Using Meta Quest 2, navigating between rooms inside the browser works correctly.  However, after Enter VR, navigating between rooms results in empty rooms. Returning to the browser, the rooms appear correctly.  The root cause of this is still under investigation.


![image](https://user-images.githubusercontent.com/25032599/174510351-d2404c4b-3d12-4a14-ab58-d7def4104b69.png)

Enter VR to experience each demo in person or touch/mouse a panel to preview an example or move/pan around.

Point the controller at a panel to activate.  Pull the `Trigger` on the controller to open/experience the example.

Click the `Grab` button to return to the home screen

### Examples

#### Ball Shooter
Pull the trigger to shoot balls

#### Dragging
Point at a shape. When highlighted, pull the trigger to move the shape.  Release the trigger to stop moving.

#### Hand Input
The example requires Oculus Quest or equivalent and is still under development

#### Teleport
Pull the trigger at a location on the floor.  Release the trigger to teleport there.

#### Physics Ball
Hit balls with a baseball bat.  Score a point when you hit one in the yellow box.

#### Grab / Inspect
When controller overlaps a cube, pull the trigger to pickup.  Release trigger to drop.  Throwing also works.

#### Drumstick / Keyboard
Use the drumstick to tap keys on the virtual keyboard to enter a message.  Press Enter to clear the message.

#### Touchpad Movement
Use the touchpad to move forward and sideways.

#### Joystick Movement
Use the joystick to move forward and sideways.

## Code Highlights
Add webxr to ngt-canvas to enable WebXR support
```html
<ngt-canvas webxr (created)="created($event)" [camera]="{ fov: 55, position: [0, 2, 4]}">
```
Add xr-controller to add left and/or right controllers into a scene.  Index 0 is left controller, Index 1 is right controller.
```html
<xr-controller showcontroller trackedpointer [index]="1"></xr-controller>
```
Add directives to xr-controller to add behaviors depending on needs
* showcontroller - shows controller
* trackedpointer - shows ray to point at stuff
* teleport - teleport to new location on floor.  Requires `[floor]` and `[room]`
```html
<xr-controller teleport showcontroller trackedpointer navhome 
               [marker]="left.instance.value" [floor]="floor.instance.value">
</xr-controller>
```

All behaviors can be enabled/disabled at runtime on either controller.  The allows behaviors to be switched between controllers if needed.
```html
<xr-controller [showcontroller]="enableshow" [trackedpointer]="enabletracking"></xr-controller>

```
