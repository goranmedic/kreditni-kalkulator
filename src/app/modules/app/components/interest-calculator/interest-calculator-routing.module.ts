import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { PaymentBreakdownComponent } from "./payment-breakdown/payment-breakdown.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const interestCalculatorRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "plan-otplate",
        component: PaymentBreakdownComponent
      },
      {
        path: "**",
        redirectTo: "/dashboard"
      }
    ]
  }
];

@NgModule({
  exports: [RouterModule]
})
export class EncoderRoutingModule {}
