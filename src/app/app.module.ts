import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base.component';
import { PaymentBreakdownComponent } from './modules/app/components/interest-calculator/payment-breakdown/payment-breakdown.component';
import { DashboardComponent } from './modules/app/components/interest-calculator/dashboard/dashboard.component';
import { PaymentSummaryComponent } from './modules/app/components/interest-calculator/payment-summary/payment-summary.component';
import { LoanSummaryComponent } from './modules/app/components/interest-calculator/loan-summary/loan-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialUIModule} from "./material-ui.module";
const components = [
  AppComponent,
  BaseComponent,
  DashboardComponent,
  PaymentBreakdownComponent,
  PaymentSummaryComponent,
  LoanSummaryComponent
];

const services = [

]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialUIModule
  ],
  providers: [
    ...services
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
