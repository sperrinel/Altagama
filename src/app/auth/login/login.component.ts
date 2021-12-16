import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  validationFormUser!: FormGroup;
  errorMessage: any;
  messageInfo: string =
    ' Un email de réinitialisation vient de vous être envoyer. Pensez à vérifier vos Spams.';
  infoReset: boolean = false;

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

  constructor(
    private users: UsersService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

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

  loginUser(value: { email: string; password: string }) {
    return new Promise<void>((resolve, reject) => {
      this.users.loginFireauth(value).then(
        () => {
          this.router.navigate(['/accueil']);
          resolve();
          this.users.isAuth == true;
          this.users.emitUsersSubject();
        },
        (error) => {
          this.errorMessage = error.toString();
          this.onGestionErreur();

          reject(error);
        }
      );
    });
  }

  onGestionErreur() {
    if (this.errorMessage.includes('network')) {
      return (this.errorMessage =
        'Une erreur liée à votre connexion internet est survenue.');
    } else {
      return (this.errorMessage =
        "Une erreur s'est produite, vérifiez votre saisie.");
    }
  }

  getResetStatut(event: boolean) {
    this.infoReset = event;
  }

  ngOnDestroy(): void {
    this.infoReset = false;
  }
}
