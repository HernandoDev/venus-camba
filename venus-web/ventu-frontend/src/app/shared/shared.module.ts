import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import * as fromComponents from './components';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CountryService } from '../demo/service/countryservice';
import { CustomerService } from '../demo/service/customerservice';
import { EventService } from '../demo/service/eventservice';
import { IconService } from '../demo/service/iconservice';
import { NodeService } from '../demo/service/nodeservice';
import {ButtonModule} from 'primeng/button';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { PhotoService } from '../demo/service/photoservice';
import {MessagesModule} from 'primeng/messages';
import {ProgressBarModule} from 'primeng/progressbar';
import {DividerModule} from 'primeng/divider';

import {MessageModule} from 'primeng/message';
import { ProductService } from '../demo/service/productservice';
import { ConfigService } from '../demo/service/app.config.service';
import { MenuService } from './components/app.menu.service';
import { AppBreadcrumbService } from './components/app.breadcrumb.service';
import {TabMenuModule} from 'primeng/tabmenu';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ColorPickerModule} from 'primeng/colorpicker';
import { MessageService } from 'primeng/api';
import {FileUploadModule} from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';


const NGPRIME_MODULES = [
  ButtonModule,
  InputNumberModule,
  FileUploadModule,
  ColorPickerModule,
  InputMaskModule,
  DividerModule,
  RadioButtonModule,
  DialogModule,
  ProgressSpinnerModule,
  MessagesModule,
  AutoCompleteModule,
  MessageModule,
  SelectButtonModule,
  ProgressBarModule,
  InputTextareaModule,
  ConfirmDialogModule,
  ConfirmPopupModule,
  InputTextModule,
  DropdownModule,
  InputSwitchModule,
  ToggleButtonModule,
  BreadcrumbModule,
  ToastModule,
  CalendarModule,
  TabMenuModule,
  TabViewModule,
  TableModule,
  FileUploadModule
];
@NgModule({
  declarations: [...fromComponents.Components],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    // Ng Prime
    ...NGPRIME_MODULES
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    // Ng Prime
    ...NGPRIME_MODULES,
    ...fromComponents.Components
  ],
  providers: [
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService, ConfigService, MenuService, AppBreadcrumbService,
    MessageService,ConfirmationService
  ]
})
export class SharedModule { }
