import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/modeles/users';

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
      prenom: new FormControl('', Validators.compose([Validators.required])),
      nom: new FormControl('', Validators.compose([Validators.required])),
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
        const role = 'visiteur';
        const email = value.email;
        const idUser = this.generateUniqueID();
        const sexe = '';
        const prenom = value.prenom;
        const nom = value.nom;
        const dateDeNaissance = '';
        const adresseDeLivraison = '';
        const adresseDeFacturation = '';

        const nouveauUser = new Users(
          email,
          role,
          idUser,
          sexe,
          prenom,
          nom,
          dateDeNaissance,
          adresseDeLivraison,
          adresseDeFacturation
        );

        this.usersService.signup(value, nouveauUser).then((resp) => {
          if (
            (resp = 'The email address is already in use by another account.')
          ) {
            this.messageErreur = 'Cette adresse email est déjà utilisée.';
          }
        });
      } catch (err) {
        console.log(err);
        this.messageErreur = "Une erreur s'est produite, veuillez réessayer";
      }
    }
  }

  generateUniqueID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
