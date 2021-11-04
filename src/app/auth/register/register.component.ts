import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  validationFormUser: FormGroup;
  errorMessage: any;

  validationUserMessage = {
    email: [
      { type: 'required', message: 'Veuillez saisir votre Email' },
      { type: 'pattern', message: 'Cet Email est incorrect' },
    ],
    password: [
      { type: 'required', message: 'Veuillez saisir votre mot de passe' },
      {
        type: 'minlength',
        message: 'Le mot de passe doit contenir minimum 8 caractères',
      },
    ],
  };
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.validationFormUser = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(8)])
      ),
    });
  }
}
