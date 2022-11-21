import { NgModule } from '@angular/core';

import { Ng3GUIComponent } from './gui/gui.component';
import { Ng3GUIItemComponent } from './gui-item/gui-item.component';
import { Ng3GUIFolderComponent } from './gui-folder/gui-folder.component';


@NgModule({
  imports: [
    Ng3GUIComponent,
    Ng3GUIItemComponent,
    Ng3GUIFolderComponent,
  ],
  exports: [
    Ng3GUIComponent,
  ]
})
export class Ng3GuiModule { }
