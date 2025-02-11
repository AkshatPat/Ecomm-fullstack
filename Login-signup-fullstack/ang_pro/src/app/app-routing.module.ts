import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './myComponents/login/login.component';
import { RegisterComponent } from './myComponents/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './myComponents/home/home.component';
import { CartComponent } from './myComponents/cart/cart.component';
import { SaleComponent } from './myComponents/sale/sale.component';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  // { path: '#', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', canActivate:[AuthGuard], component: HomeComponent },
  { path: 'cart', canActivate:[AuthGuard], component: CartComponent },
  { path: 'sale', canActivate:[AuthGuard], component: SaleComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
