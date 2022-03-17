import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-a-domicile',
  templateUrl: './a-domicile.component.html',
  styleUrls: ['./a-domicile.component.css'],
})
export class ADomicileComponent implements OnInit {
  messageInfo: string = 'Votre formulaire a bien été envoyé.';
  token: string = '';
  infoContact: boolean = false;
  formData: FormGroup;
  siteKey = '6LcGVRcdAAAAABot7A1ecGhHWRvKINUhPyjCquG-';
  messageErreur: string = '';

  validationFormMessage = {
    participant: [
      {
        type: 'min',
        message:
          'il faut un minimum de 7 participants pour une dégustation à domicile.',
      },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private contact: ContactService,
    private router: Router
  ) {
    this.token = '';
  }

  ngOnInit(): void {
    this.infoContact = false;
    this.formData = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.compose([Validators.required, Validators.email]),
      ]),
      telephone: new FormControl(''),
      objet: new FormControl(''),
      participant: new FormControl('', [
        Validators.required,
        Validators.min(7),
      ]),
      message: new FormControl('', [Validators.required]),
      'g-recaptcha-response': new FormControl(''),
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }
    let formValue = this.fb.group({
      nom: this.formData.value.nom,
      email: this.formData.value.email,
      telephone: '0' + this.formData.value.telephone,
      objet: this.formData.value.objet,
      participant: this.formData.value.participant,
      message: this.formData.value.message,
      'g-recaptcha-response': this.token,
    });
    this.contact.postMessage(formValue.value);
    this.infoContact = true;
    setTimeout(() => {
      this.infoContact = false;
      this.router.navigate(['/accueil']);
    }, 5000);
  }
}
