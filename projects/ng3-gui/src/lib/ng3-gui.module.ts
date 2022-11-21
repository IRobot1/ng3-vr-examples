import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgtGroupModule } from '@angular-three/core/group';

import { Ng3GUIComponent } from './gui/gui.component';
import { Ng3GUIItemComponent } from './gui-item/gui-item.component';
import { Ng3GUIFolderComponent } from './gui-folder/gui-folder.component';

import { Ng3FlatUiModule } from 'ng3-flat-ui';


@NgModule({
  declarations: [
    Ng3GUIItemComponent,
    Ng3GUIFolderComponent,
    Ng3GUIComponent,
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
