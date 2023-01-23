import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';

import { Ng3FlatUiModule } from 'ng3-flat-ui';

import { Ng3FileListComponent } from './ng3-file-list.component';

@NgModule({
  declarations: [
    Ng3FileListComponent
  ],
  imports: [
    CommonModule,
    MomentModule,
    NgtGroupModule,
    NgtMeshBasicMaterialModule,
    Ng3FlatUiModule,
  ],
  exports: [
    Ng3FileListComponent
  ]
})
export class Ng3FileListModule { }
