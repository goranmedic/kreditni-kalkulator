import { NgModule } from '@angular/core';
import {MatSlideToggleModule, MatCheckboxModule, MatToolbarModule} from '@angular/material'
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
        MatTableModule,
        MatToolbarModule
    ],
    exports: [
        MatSlideToggleModule, 
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatToolbarModule
    ]   
})
export class MaterialUIModule {}