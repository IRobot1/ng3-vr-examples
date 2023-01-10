# Ng3 Flat UI

Angular UI component library for [three.js](https://threejs.org/) 

![image](https://user-images.githubusercontent.com/25032599/211678766-a8903316-5271-4b1e-9eb3-acf7acb044ce.png)

Components work in browser window using touch or mouse.

Components also work in VR using ray caster to provide an in-scene user interface.

Components include
* button
* card actions
* icon button
* checkbox
* color
* number
* slider
* text
* toggle
* label
* progress bar
* radio button
* drop-down list
* icon
* tabs
* data grid with optional pagination
* avatar icon
* image
* card with optional drag support
* card actions
* divider
* material icon and button
* menu and mini-menu
* multi-line text input with scrolling

Panels include
* expansion panel
* dragable panel (window)

Input methods include
* keyboard
* number pad
* color picker
* list

Group directives are provided for automatic vertical or horiztonal layout.

A default theme is provided, but can be override. A matrix theme provides example of doing this.

Components use [angular-three](https://github.com/nartc/angular-three) as a foundation for defining scene objects.

# Documentation

See [ng3-flat-ui](https://github.com/IRobot1/ng3-vr-examples/wiki/ng3-flat-ui-components) for detailed documentation

# Before you Start
This library assumes you have a decent understanding of three.js scene, lighting, geometry and material.  Also, being familiar with angular-three really helps.

# Getting started
Start with recent Angular CLI project

`ng add @angular-three/schematics`

`ng add @angular-three/soba`

`ng add ng3-flat-ui`

To app.module.ts, add the following
```ts
import { NgtCanvasModule } from '@angular-three/core';
import { NgtStatsModule } from '@angular-three/core/stats';

import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';

import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtAmbientLightModule } from '@angular-three/core/lights';

import { Ng3FlatUiModule } from 'ng3-flat-ui';
```

Under imports, add
```ts
    NgtCanvasModule,
    NgtStatsModule,

    NgtMeshModule,
    NgtBoxGeometryModule,
    NgtMeshBasicMaterialModule,

    NgtColorAttributeModule,
    NgtAmbientLightModule,

    Ng3FlatUiModule,
```

Modify app.component.html or add the following to a component
```html
<div style="height:100vh">
  <ngt-canvas [camera]="{ position: [0, 0, 3]}">
    <ngt-color attach="background" color="black"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>

    <ngt-mesh [position]="[0, -0.2, 0]" [rotation]="[0, 1.57/2, 0]">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-basic-material [color]="color"></ngt-mesh-basic-material>
    </ngt-mesh>

    <flat-ui-button [text]="'click me'" [position]="[0, 0.5, 0]" (pressed)="color='blue'"></flat-ui-button>

    <ngt-stats></ngt-stats>
  </ngt-canvas>
</div>
```

Modify app.component.ts or component you added, add the following class variable
```js
  color = 'red';
```

Finally, modify styles.css to remove the border around the canvas
```css
body {
  margin: 0px;
}
```

Click the button to change the cube blue

![image](https://user-images.githubusercontent.com/25032599/196293920-adfa3833-45b2-4847-aae6-e4b574e63397.png)

## Questions
### Are you planning a version that works without angular-three
No.  This would be a great student project.

### Are you planning a version that works with react-fiber
No.  This would be a great student project.

# Roadmap
List of features that would be nice to add (in no particular order)
* sizable multi-line text area
* UI sounds
* keyboard multi-language support (requires better default font)
* text regular expression support
* scrollbar (difficult without clipping support, so probably needs to be re-imagined)
* date picker
* time picker
* chips - requires knowing text length to size the chip correctly
* hand input

