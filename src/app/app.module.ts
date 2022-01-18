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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DegustationsComponent } from './components/degustations/degustations.component';
import { ADomicileComponent } from './components/degustations/a-domicile/a-domicile.component';
import { ContactService } from './services/contact.service';
import {
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
  RECAPTCHA_SETTINGS,
} from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { AddProduitComponent } from './components/boutique/add-produit/add-produit.component';
import { CategoriesComponent } from './components/boutique/categories/categories.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MentionsLegalesComponent } from './components/mentions-legales/mentions-legales.component';
import { ButtonPaypalComponent } from './button-paypal/button-paypal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { AdminComponent } from './admin/admin.component';
import { GestionCommandesComponent } from './admin/gestion-commandes/gestion-commandes.component';
import { NgxPayPalModule } from 'ngx-paypal';
const appRoutes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'add', component: AddProduitComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'single-produit/:id', component: SingleProduitComponent },
  { path: 'categorie/:id', component: CategoriesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'degustations', component: DegustationsComponent },
  { path: 'degustations-a-domicile', component: ADomicileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'mentions-legales', component: MentionsLegalesComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '', component: AccueilComponent },
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
    DegustationsComponent,
    ADomicileComponent,
    AddProduitComponent,
    CategoriesComponent,
    ResetPasswordComponent,
    MentionsLegalesComponent,
    ButtonPaypalComponent,
    MessageModalComponent,
    AdminComponent,
    GestionCommandesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserAnimationsModule,
    NgxPayPalModule,
  ],
  providers: [
    ContactService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
