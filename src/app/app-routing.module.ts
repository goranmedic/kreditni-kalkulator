import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseComponent } from "./base.component";
import { interestCalculatorRoutes } from "./modules/app/components/interest-calculator/interest-calculator-routing.module";
import { BugReportComponent } from './modules/app/components/bug-report/bug-report.component';


const commonRoutes = [
    {
        path: "prijava-problema",
        component: BugReportComponent
    }
]


const routes: Routes = [
  {
    path: "",
    component: BaseComponent,
    children: [...interestCalculatorRoutes,
    ...commonRoutes]
  },

  {
    path: "**",
    redirectTo: "/izracun-kredita"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
