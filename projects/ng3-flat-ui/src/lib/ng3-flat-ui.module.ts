import { NgModule } from '@angular/core';

import { NgtCanvasModule, NgtObjectPassThrough, NgtRadianPipeModule } from '@angular-three/core';
import { NgtBoxGeometryModule, NgtBufferGeometryModule, NgtCircleGeometryModule, NgtPlaneGeometryModule, NgtRingGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule, NgtLineBasicMaterialModule, } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtLineModule } from '@angular-three/core/lines';

import { NgtSobaTextModule } from '@angular-three/soba/abstractions';

import { FlatUIButton } from './button/button.component';
import { FlatUIColorPicker } from './color-picker/color-picker.component';
import { FlatUIDragPanel } from './drag-panel/drag-panel.component';
import { FlatUIExpansionPanel } from './expansion-panel/expansion-panel.component';
import { HorizontalLayoutDirective } from './horizontal-layout.directive';
import { FlatUIIconButton } from './icon-button/icon-button.component';
import { FlatUIInputCheckbox } from './input-checkbox/input-checkbox.component';
import { FlatUIInputColor } from './input-color/input-color.component';
import { FlatUIInputNumber } from './input-number/input-number.component';
import { FlatUIInputSlider } from './input-slider/input-slider.component';
import { FlatUIInputText } from './input-text/input-text.component';
import { FlatUIInputToggle } from './input-toggle/input-toggle.component';
import { FlatUIKeyboard } from './keyboard/keyboard.component';
import { FlatUILabel } from './label/label.component';
import { FlatUIList } from './list/list.component';
import { FlatUINumpad } from './numpad/numpad.component';
import { FlatUIProgressBar } from './progress-bar/progress-bar.component';
import { FlatUIRadioButton } from './radio-button/radio-button.component';
import { FlatUISelect } from './select/select.component';
import { VerticalLayoutDirective } from './vertical-layout.directive';
import { CommonModule } from '@angular/common';
import { FlatUIRadioGroup } from './radio-group/radio-group.component';
import { FlatUIIcon } from './icon/icon.component';
import { FlatUITab } from './tab/tab.component';
import { FlatUITabGroup } from './tab-group/tab-group.component';
import { FlatUIDataGrid } from './data-grid/data-grid.component';
import { FlatUIDataGridColumn } from './data-grid-column/data-grid-column.component';
import { FlatUIInputTextArea } from './input-textarea/input-textarea.component';
import { FlatUIPaginator } from './paginator/paginator.component';



@NgModule({
  declarations: [
    FlatUIButton,
    FlatUIIcon,
    FlatUIIconButton,
    FlatUIInputCheckbox,
    FlatUIInputColor,
    FlatUIInputNumber,
    FlatUIInputSlider,
    FlatUIInputText,
    FlatUIInputTextArea,
    FlatUIInputToggle,
    FlatUILabel,
    FlatUIProgressBar,
    FlatUIRadioButton,
    FlatUIRadioGroup,
    FlatUISelect,
    FlatUITab,
    FlatUITabGroup,

    FlatUIColorPicker,
    FlatUIKeyboard,
    FlatUIList,
    FlatUINumpad,

    FlatUIDragPanel,
    FlatUIExpansionPanel,

    FlatUIDataGrid,
    FlatUIDataGridColumn,
    FlatUIPaginator,

    HorizontalLayoutDirective,
    VerticalLayoutDirective,
  ],
  imports: [
    CommonModule,

    NgtCanvasModule,
    NgtRadianPipeModule,
    NgtObjectPassThrough,

    NgtMeshModule,
    NgtLineModule,
    NgtGroupModule,

    NgtBufferGeometryModule,
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
    NgtCircleGeometryModule,
    NgtRingGeometryModule,

    NgtMeshBasicMaterialModule,
    NgtLineBasicMaterialModule,

    // soba
    NgtSobaTextModule,

  ],
  exports: [
    FlatUIButton,
    FlatUIIcon,
    FlatUIIconButton,
    FlatUIInputCheckbox,
    FlatUIInputColor,
    FlatUIInputNumber,
    FlatUIInputSlider,
    FlatUIInputText,
    FlatUIInputTextArea,
    FlatUIInputToggle,
    FlatUILabel,
    FlatUIProgressBar,
    FlatUIRadioButton,
    FlatUIRadioGroup,
    FlatUISelect,
    FlatUITab,
    FlatUITabGroup,

    FlatUIColorPicker,
    FlatUIKeyboard,
    FlatUIList,
    FlatUINumpad,

    FlatUIDragPanel,
    FlatUIExpansionPanel,

    FlatUIDataGrid,
    FlatUIDataGridColumn,
    FlatUIPaginator,

    HorizontalLayoutDirective,
    VerticalLayoutDirective,
  ]
})
export class Ng3FlatUiModule { }
