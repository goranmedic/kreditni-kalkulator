import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseComponent } from "./base.component";
import { interestCalculatorRoutes } from "./modules/app/components/interest-calculator/interest-calculator-routing.module";

const routes: Routes = [
  {
    path: "",
    component: BaseComponent,
    children: [...interestCalculatorRoutes]
  },
  {
    path: "**",
    redirectTo: "/dashboard"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
