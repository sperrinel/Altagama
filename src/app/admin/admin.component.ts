import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  toggleCommande: boolean = true;
  toggleAddProduit: boolean = false;
  messageMAJuser: boolean = false;
  message: string = '';
  codeAcces: boolean = false;
  code: string = `${environment.gestionCommandes}`;
  codeAccesForm!: FormGroup;
  templateAcces: boolean = true;
  toggleCodePromo: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.toggleAddProduit = false;
    this.toggleCodePromo = false;
    this.toggleCommande = true;
    this.message = '';
    this.templateAcces = false;
    this.codeAcces = false;
    this.messageMAJuser = false;

    this.codeAccesForm = this.formBuilder.group({
      password: new FormControl(''),
    });
  }

  voirCommandes() {
    this.toggleAddProduit = false;
    this.toggleCodePromo = false;
    this.toggleCommande = true;
  }
  accesAjoutProduit() {
    this.toggleCommande = false;
    this.toggleCodePromo = false;
    this.toggleAddProduit = true;
  }
  accesAjoutCodePromo() {
    this.toggleCommande = false;
    this.toggleAddProduit = false;
    this.toggleCodePromo = true;
  }

  validerAcces(codeAccesForm) {
    const data = codeAccesForm['password'];

    if (data == this.code) {
      this.codeAcces = true;
      this.templateAcces = true;
    } else {
      this.message = 'Une erreur est survenue';
    }
  }

  ngOnDestroy(): void {
    this.templateAcces = false;
    this.codeAcces = false;
  }
}
