import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Categorie } from '../modeles/categorie';
import DataSnapshot = firebase.database.DataSnapshot;
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  categories: Categorie[];
  categorieSubject = new Subject<Categorie[]>();
  constructor() {
    this.getCategorieFromServer(); //Lorsque le service sera injecté quelque part, grâce à cela les données seront tout de suite mises à jour.
  }

  getCategorieFromServer() {
    return new Promise<Categorie[]>((resolve, reject) => {
      firebase
        .database()
        .ref('/produits/categories')
        .once('value')
        .then(
          (data: DataSnapshot) => {
            resolve(data.val());
            this.categories = data.val() ? data.val() : [];
            this.emitCategoriessSubject();
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  //Permet de rendre disponible l'observable
  emitCategoriessSubject() {
    this.categorieSubject.next(this.categories);
  }
}
