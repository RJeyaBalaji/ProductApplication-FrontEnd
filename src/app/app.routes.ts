import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { AddProducts } from './components/add-products/add-products';
import { ProductView } from './product-view/product-view';
import { ProductEdit } from './components/product-edit/product-edit';
import { CartComponent } from './components/cart/cart';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AuthGuard } from './service/authguard-guard';
import { Checkout } from './components/checkout/checkout';
import { Profile } from './components/profile/profile';
import { MyOrders } from './components/my-orders/my-orders';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'add-product', component: AddProducts, canActivate: [AuthGuard] },
    { path: 'product/:id', component: ProductView, canActivate: [AuthGuard] },
    { path: 'product/edit/:id', component: ProductEdit, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductList, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', component: Signup},
    { path: 'checkout', component: Checkout, canActivate: [AuthGuard] },
    { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    { path: 'my-orders', component: MyOrders, canActivate: [AuthGuard] },
];