import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { PrescriptionRecordComponent } from "./components/prescription-list/prescription-list.component";
import { ShipmentListComponent } from './components/shipment-list/shipment-list.component';
import { LoginCallbackComponent } from './components/login-callback/login-callback.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "login", component: LoginComponent },
  { path: "eggbox-list", component: PrescriptionRecordComponent },
  { path: "shipment-list", component: ShipmentListComponent },
  { path: "auth/google/callback", component: LoginCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
