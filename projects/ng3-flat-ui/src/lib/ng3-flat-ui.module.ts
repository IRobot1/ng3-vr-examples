import { NgModule } from '@angular/core';

import { FlatUIBaseButton } from './base-button/base-button.component';
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
import { FlatUIRadioGroup } from './radio-group/radio-group.component';
import { FlatUIIcon } from './icon/icon.component';
import { FlatUITab } from './tab/tab.component';
import { FlatUITabGroup } from './tab-group/tab-group.component';
import { FlatUIDataGrid } from './data-grid/data-grid.component';
import { FlatUIDataGridColumn } from './data-grid-column/data-grid-column.component';
import { FlatUIInputTextArea } from './input-textarea/input-textarea.component';
import { FlatUIPaginator } from './paginator/paginator.component';
import { FlatUIBasicImage } from './basic-image/basic-image.component';
import { FlatUIDivider } from './divider/divider.component';
import { FlatUIMaterialIcon } from './material-icon/material-icon.component';
import { FlatUIAvatar } from './avatar/avatar.component';
import { FlatUICard } from './card/card.component';
import { DraggableDirective, DropListDirective } from './drag-and-drop';
import { FlatUICardActions } from './card-actions/card-actions.component';
import { FlatUICardAction } from './card-action/card-action.component';
import { FlatUIMaterialButton } from './material-button/material-button.component';
import { FlatUIMenu } from './menu/menu.component';
import { FlatUIMenuMini } from './menu-mini/menu-mini.component';
import { FlatUIMenuItem } from './menu-item/menu-item.component';
import { FlatUIConfirm } from './confirm/confirm.component';



@NgModule({
  imports: [
    FlatUIAvatar,
    FlatUIBaseButton,
    FlatUIBasicImage,
    FlatUIButton,
    FlatUICard,
    FlatUICardAction,
    FlatUICardActions,
    FlatUIIcon,
    FlatUIIconButton,
    FlatUIDivider,
    FlatUIInputCheckbox,
    FlatUIInputColor,
    FlatUIInputNumber,
    FlatUIInputSlider,
    FlatUIInputText,
    FlatUIInputTextArea,
    FlatUIInputToggle,
    FlatUIProgressBar,
    FlatUIRadioButton,
    FlatUIRadioGroup,
    FlatUISelect,
    FlatUITab,
    FlatUITabGroup,
    FlatUILabel,
    FlatUIMaterialIcon,
    FlatUIMaterialButton,
    FlatUIMenu,
    FlatUIMenuMini,
    FlatUIMenuItem,

    FlatUIColorPicker,
    FlatUIKeyboard,
    FlatUIList,
    FlatUINumpad,
    FlatUIConfirm,

    FlatUIPaginator,
    FlatUIDragPanel,
    FlatUIExpansionPanel,

    FlatUIDataGrid,
    FlatUIDataGridColumn,

    HorizontalLayoutDirective,
    VerticalLayoutDirective,

    DropListDirective,
    DraggableDirective,
  ],
  exports: [
    FlatUIAvatar,
    FlatUIBaseButton,
    FlatUIButton,
    FlatUICard,
    FlatUICardActions,
    FlatUICardAction,
    FlatUIIcon,
    FlatUIIconButton,
    FlatUIBasicImage,
    FlatUIDivider,
    FlatUIInputCheckbox,
    FlatUIInputColor,
    FlatUIInputNumber,
    FlatUIInputSlider,
    FlatUIInputText,
    FlatUIInputTextArea,
    FlatUIInputToggle,
    FlatUILabel,
    FlatUIMaterialIcon,
    FlatUIMaterialButton,
    FlatUIMenu,
    FlatUIMenuMini,
    FlatUIMenuItem,
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
    FlatUIConfirm,

    FlatUIDragPanel,
    FlatUIExpansionPanel,

    FlatUIDataGrid,
    FlatUIDataGridColumn,
    FlatUIPaginator,

    HorizontalLayoutDirective,
    VerticalLayoutDirective,

    DropListDirective,
    DraggableDirective,
  ]
})
export class Ng3FlatUiModule { }
