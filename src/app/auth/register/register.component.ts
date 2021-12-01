import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: any;
  messageErreur: string = '';

  validationUserMessage = {
    email: [
      { type: 'required', message: 'Veuillez saisir une adresse email' },
      { type: 'pattern', message: 'adresse mail valide : email@exemple.fr' },
    ],
    password: [
      { type: 'required', message: 'Veuillez saisir un mot de passe' },
      {
        type: 'minlength',
        message: 'Le mot de passe doit contenir minimum 8 caractères',
      },
    ],
  };
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      confirmEmail: new FormControl(
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
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(8)])
      ),
    });
  }

  onSubmit(value) {
    this.messageErreur = '';
    if (value.password !== value.confirmPassword) {
      this.messageErreur =
        'Les mots de passe ne sont pas identiques, veuillez essayer à nouveau.';
      return;
    } else if (value.email !== value.confirmEmail) {
      this.messageErreur =
        'Les adresses mail ne correspondent pas, veuillez vérifier votre saisie.';
      return;
    } else {
      try {
        this.usersService.signup(value).then((resp) => {
          if (
            (resp = 'The email address is already in use by another account.')
          ) {
            this.messageErreur = 'Cette adresse email est déjà utilisée.';
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
