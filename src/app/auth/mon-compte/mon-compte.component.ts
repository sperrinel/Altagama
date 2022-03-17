import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Adresse } from 'src/app/modeles/adresse';
import { Users } from 'src/app/modeles/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.css'],
})
export class MonCompteComponent implements OnInit {
  userEnCours: Users;
  messageMAJuser: boolean = false;
  updateUser: boolean = true;
  deleteUser: boolean = false;
  message: string = 'Les modifications ont été prises en compte. Merci';
  updateUserForm;

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
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,
    fb: FormBuilder
  ) {
    this.updateUserForm = fb.group({
      rue: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      telephone: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userEnCours = this.usersService.getUser();
    this.messageMAJuser = false;
    this.updateUser = true;
    this.deleteUser = false;

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

  deleteProfile() {
    this.updateUser = false;
    this.userEnCours = this.usersService.getUser();

    this.deleteUser = true;
  }

  updateProfile() {
    this.deleteUser = false;
    this.userEnCours = this.usersService.getUser();

    this.updateUser = true;
  }

  onSubmitUpdateUserForm() {
    const formValue = this.updateUserForm.value;

    const autreAdresseClient = this.userEnCours.autreAdresse;
    const adresseLivraisonClient = new Adresse(
      formValue['rue'],
      formValue['codePostal'],
      formValue['ville'].toUpperCase(),
      formValue['pays'].toUpperCase()
    );
    const adresseDeFacturation: Adresse = adresseLivraisonClient;
    const telephone = formValue['telephone'];
    const prenom = formValue['prenom'];
    const nom = formValue['nom'];
    const updateUser = new Users(
      this.userEnCours.email,
      this.userEnCours.role,
      this.userEnCours.idUser,
      prenom,
      nom,
      this.userEnCours.dateDeNaissance,
      telephone,
      adresseLivraisonClient,
      adresseDeFacturation,
      autreAdresseClient
    );

    this.usersService.updateUser(updateUser);
    this.updateUser = false;
    this.messageMAJuser = true;
    setTimeout(() => {
      this.messageMAJuser = false;
    }, 4000);
  }

  loginUser(value: { email: string; password: string }) {
    return new Promise<void>((resolve, reject) => {
      this.usersService.loginFireauth(value).then(
        () => {
          resolve();
          this.usersService.isAuth == true;
          this.usersService.emitUsersSubject();
          firebase.auth().currentUser.delete();
          this.router.navigate(['/accueil']);
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
}
