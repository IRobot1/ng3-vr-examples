VR Examples for @angular-three

[DEMO here](https://ng3vr.z9.web.core.windows.net/)

![image](https://user-images.githubusercontent.com/25032599/182047284-40ef9a33-db46-4591-90f0-3455f0b22fba.png)

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

#### Toggle Controller Behavior
Point controller at a button to enable/disable that capability on the controller.  Capabilites include dragging shapes, teleporting, highlighting and showing the track pointer and controller model

#### Lights, Camera, Action
Wall textures show what camera 1 and 2 can see.  Grab and move the cameras.  Grab and move spot lights.

#### Paint
Pull trigger and move controller to start painting.  Use the joystick to increase/decrease the size of the paint brush.

#### HTML Mesh GUI
Shows lil-GUI being used in VR.  Point at sliders to change shape parameters

#### World Scale
Pull triggers on both controllers.  Moving controllers closer makes the model smaller.  Moving apart ameks the model larger.

## Code Highlights
Add webvr to ngt-canvas to enable WebVR support
```html
<ngt-canvas webvr (created)="created($event)" [camera]="{ fov: 55, position: [0, 2, 4]}">
```
Add vr-controller to add left and/or right controllers into a scene.  Index 0 is left controller, Index 1 is right controller.
```html
<vr-controller showcontroller trackedpointer [index]="1"></vr-controller>
```
Add directives to vr-controller to add behaviors depending on needs
* showcontroller - shows controller
* trackedpointer - shows ray to point at stuff
* teleport - teleport to new location on floor.  Requires `[floor]` and `[room]`
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
