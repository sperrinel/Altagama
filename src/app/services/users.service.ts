import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Users } from '../modeles/users';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // user: Users;
  // userSubject = new Subject<Users>();
  isAuth: boolean = false;
  isAuthSubject = new Subject<boolean>();
  constructor() {}

  // emitUser(): void {
  //   this.userSubject.next(this.user);
  // }

  //Connexion
  async loginFireauth(value: { email: string; password: string }) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (data) => {
            resolve(data);
            console.log(data);
          },
          (error) => reject(error)
        );
    });
  }

  //Déconnexion
  logout() {
    firebase.auth().signOut();
    localStorage.removeItem('user');
    this.isAuth == false;
  }

  emitIsAuthSubject() {
    this.isAuthSubject.next(this.isAuth);
  }
}
