import { NgModule } from '@angular/core';
import {MatSlideToggleModule, MatCheckboxModule} from '@angular/material'
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
@NgModule({
  declarations: [],
  imports: [
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule
  ],
  exports: [MatSlideToggleModule, MatCheckboxModule,MatRadioModule,MatButtonModule,MatInputModule,MatTableModule]
})
export class MaterialUIModule {}