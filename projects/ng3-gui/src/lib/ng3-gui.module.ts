import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgtGroupModule } from '@angular-three/core/group';

import { Ng3GUIComponent } from './gui/gui.component';
import { Ng3GUIFolderComponent, Ng3GUIItemComponent } from './gui-item/gui-item.component';
import { Ng3GUIPanelComponent } from './gui-panel/gui-panel.component';

import { Ng3FlatUiModule } from 'ng3-flat-ui';
import { NgtObjectPassThroughModule } from '@angular-three/core';


@NgModule({
  declarations: [
    Ng3GUIItemComponent,
    Ng3GUIFolderComponent,
    Ng3GUIPanelComponent,
    Ng3GUIComponent,
  ],
  imports: [
    CommonModule,
    NgtGroupModule,
    NgtObjectPassThroughModule,
    Ng3FlatUiModule,
  ],
  exports: [
    Ng3GUIComponent,
    Ng3GUIPanelComponent,
  ]
})
export class Ng3GuiModule { }
