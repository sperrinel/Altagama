import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  toggleCommande = false;
  messageMAJuser = false;
  message: string = '';
  codeAcces: boolean = false;
  code: string = 'test';
  codeAccesForm!: FormGroup;
  templateAcces = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.message = '';
    this.templateAcces = false;
    this.codeAcces = false;
    this.messageMAJuser = false;
    this.toggleCommande = false;

    this.codeAccesForm = this.formBuilder.group({
      password: new FormControl(''),
    });
  }

  voirCommandes() {
    this.toggleCommande = true;
  }

  validerAcces(codeAccesForm) {
    const data = codeAccesForm['password'];
    console.log(data);

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
