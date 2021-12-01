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
  constructor(
    private fb: FormBuilder,
    private contact: ContactService,
    private router: Router
  ) {
    this.token = '';
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.compose([Validators.required, Validators.email]),
      ]),
      telephone: new FormControl(''),
      objet: new FormControl(''),
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
      message: this.formData.value.message,
      'g-recaptcha-response': this.token,
    });
    this.contact.postMessage(formValue.value);
    this.infoContact = true;
  }
}
