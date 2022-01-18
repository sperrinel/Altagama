import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Users } from '../modeles/users';
import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users: Users[] = [];
  // dialog: any;
  // user: Users;
  // userSubject = new Subject<Users>();
  isAuth: boolean = false;
  isAuthSubject = new Subject<boolean>();
  usersSubject = new Subject<Users[]>();
  constructor(private router: Router) {
    this.getUsersFromServer();
  }

  //Récupère liste entière des users.
  getUsersFromServer() {
    firebase
      .database()
      .ref('/users')
      .on('value', (data: DataSnapshot) => {
        this.users = data.val() ? data.val() : [];
        this.emitUsersSubject();
      });
  }

  // emitUser(): void {
  //   this.userSubject.next(this.user);
  // }

  //Inscription
  // async signup(value: { email: string; password: string }) {
  //   firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(value.email, value.password)
  //     .then((res) => {
  //       this.isAuth = true;
  //       this.router.navigate(['/accueil']);
  //       localStorage.setItem('user', JSON.stringify(res.user));
  //     },);
  // }

  //Inscription
  async signup(value: { email: string; password: string }, nouveauUser) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => {
            this.isAuth = true;
            this.router.navigate(['/accueil']);
            this.addUser(nouveauUser);
            localStorage.setItem('user', JSON.stringify(res.user));
            resolve(res);
          },
          (error) => {
            resolve(error);
          }
        );
    });
  }

  //Connexion
  async loginFireauth(value: { email: string; password: string }) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (data) => {
            localStorage.setItem('user', JSON.stringify(data.user));
            resolve(data);
            console.log(data);
          },
          (error) => reject(error)
        );
    });
  }

  //Connexion
  // async loginFireauth(value: { email: string; password: string }) {
  //   return new Promise<any>((resolve, reject) => {
  //     firebase
  //       .auth()
  //       .signInWithEmailAndPassword(value.email, value.password)
  //       .then(
  //         (data) => {
  //           const indexUser = this.users.findIndex(
  //             (element) => element.email == value.email
  //           );
  //           //Attribution du rôle de l'user.
  //           if (data.user.uid == 'ygr74qVO1ghSxGeOfFZJvtN5hFc2') {
  //             this.users[indexUser].role = 'admin';
  //           } else {
  //             this.users[indexUser].role = 'visiteur';
  //           }
  //           resolve(data);
  //           console.log(this.users[indexUser]);
  //         },
  //         (error) => reject(error)
  //       );
  //   });
  // }

  //Déconnexion
  logout() {
    firebase.auth().signOut();
    localStorage.removeItem('user');
    this.isAuth == false;
  }

  emitIsAuthSubject() {
    this.isAuthSubject.next(this.isAuth);
  }

  resetPassword(email: string) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log(
          'Un email de réinitialisation vient de vous être envoyer. Pensez à vérifier vos Spams.'
        );
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  }

  // Ajouter un user
  // addUser(nouveauUser: Users) {
  //   this.users.push(nouveauUser);
  //   this.saveUsersToServer();
  //   this.emitUsersSubject();
  // }

  //Enregistre tous les users en BDD
  // saveUsersToServer() {
  //   firebase.database().ref('/users').set(this.users);
  // }

  //Récupère liste entière des users.
  // getProduitsFromServer() {
  //   firebase
  //     .database()
  //     .ref('/users')
  //     .on('value', (data: DataSnapshot) => {
  //       this.users = data.val() ? data.val() : [];
  //       this.emitUsersSubject();
  //     });
  // }

  // emitUsersSubject() {
  //   this.usersSubject.next(this.users);
  // }

  // Ajouter un nouveau utilisateur
  addUser(nouveauUser: Users) {
    this.users.push(nouveauUser);
    this.saveUsersToServer();
    this.emitUsersSubject();
  }

  emitUsersSubject() {
    this.usersSubject.next(this.users);
  }

  //Enregistre tous les users en BDD
  saveUsersToServer() {
    firebase.database().ref('/users').set(this.users);
  }

  //Mettre à jour utilisateur sur le serveur.
  updateUser(user: Users) {
    let usersTab = this.users;
    let userEmail = user.email;
    let userIndex = usersTab.findIndex((element) => element.email == userEmail);
    this.users[userIndex] = user;
    this.saveUsersToServer();
    this.emitUsersSubject();
  }
}
