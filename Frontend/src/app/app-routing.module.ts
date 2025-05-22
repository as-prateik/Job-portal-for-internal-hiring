import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'employee-dashboard',component:EmployeeDashboardComponent},
  {path:'hr-dashboard',component:HrDashboardComponent},
  {path:'manager-dashboard',component:ManagerDashboardComponent},
  {path:'edit-profile', component:EditProfileComponent},
  {path:'**',redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
