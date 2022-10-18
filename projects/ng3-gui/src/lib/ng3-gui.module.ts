import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Ng3FlatUiModule } from 'ng3-flat-ui';

import { Ng3GUIComponent } from './gui/gui.component';
import { Ng3GUIFolderComponent, Ng3GUIItemComponent } from './gui-item/gui-item.component';
import { NgtGroupModule } from '@angular-three/core/group';


@NgModule({
  declarations: [
    Ng3GUIComponent,
    Ng3GUIItemComponent,
    Ng3GUIFolderComponent,
  ],
  imports: [
    CommonModule,
    NgtGroupModule,
    Ng3FlatUiModule,
  ],
  exports: [
    Ng3GUIComponent,
  ]
})
export class Ng3GuiModule { }
