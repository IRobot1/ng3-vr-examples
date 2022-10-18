# Angular Three version of [lil-gui](https://lil-gui.georgealways.com/)

Interface matches lil-gui, so easy drop-in replacement for use within a three scene.

```ts
import { Ng3GUI } from 'ng3-gui'; 

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

```

Component works in browser window using touch or mouse.

Components also work in VR using ray caster to provide an in-scene user interface.
