import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BoutiqueComponent } from './components/boutique/boutique.component';
import { ProduitsComponent } from './components/boutique/produits/produits.component';
import { SingleProduitComponent } from './components/boutique/single-produit/single-produit.component';
import { PanierComponent } from './components/boutique/panier/panier.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { CommonModule } from '@angular/common';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { ModalAddPanierComponent } from './components/boutique/modal-add-panier/modal-add-panier.component';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: 'accueil', component: ComingSoonComponent },
  // { path: 'accueil', component: AccueilComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'panier', component: PanierComponent },
  // { path: 'single-produit/:id', component: SingleProduitComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '', component: ComingSoonComponent },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AccueilComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    BoutiqueComponent,
    ProduitsComponent,
    SingleProduitComponent,
    PanierComponent,
    NotfoundComponent,
    ComingSoonComponent,
    ModalAddPanierComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
