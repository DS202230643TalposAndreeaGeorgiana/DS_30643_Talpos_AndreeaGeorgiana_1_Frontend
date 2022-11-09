import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AdminComponent} from "./components/admin/admin.component";
import {UserComponent} from "./components/user/user.component";
import {ErrorComponent} from "./components/error/error.component";
import {AuthGuard} from "./auth.guard";



const routes: Routes = [
  {
    path:'', component: LoginComponent,

  },
  {
    path:'admin', component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_ADMIN'
    }
  },
  {
    path:'client', component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_CLIENT'
    }
  },
  {
    path:'**', component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
