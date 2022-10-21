# Angular Three version of [lil-gui](https://lil-gui.georgealways.com/)

![image](https://user-images.githubusercontent.com/25032599/196543108-dae2ae7c-f6d8-4b89-9b21-e93bee66376e.png)

For use in threejs scenes built using [angular-three](https://github.com/nartc/angular-three).  Uses ng3-flat-ui controls and theme.

Interface matches lil-gui, so easy drop-in replacement for use within a three scene.

```ts
import { Ng3GUI } from 'ng3-gui'; 

selectable = new InteractiveObjects();
basic!: Ng3GUI;

ngOnInit(): void {
  const gui = new Ng3GUI();

  const myObject = {
	  myBoolean: true,
	  myFunction: function() { ... },
	  myString: 'lil-gui',
	  myNumber: 1
  };

  gui.add( myObject, 'myBoolean' );  // Checkbox
  gui.add( myObject, 'myFunction' ); // Button
  gui.add( myObject, 'myString' );   // Text Field
  gui.add( myObject, 'myNumber' );   // Number Field

  this.basic = gui;
}
```

```html
<ng3-gui [position]="[1.7, 1, -2]"  [gui]="basic" [selectable]="selectable"></ng3-gui>
```

Component works in browser window using touch or mouse.  GUI windows can be moved along x-y plane.

Component also work in VR using ray caster to provide an in-scene user interface.  Windows can be dragged around scene.

