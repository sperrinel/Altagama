import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CodesPromo } from '../modeles/codesPromo';
import DataSnapshot = firebase.database.DataSnapshot;
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CodesPromoService {
  codesPromoSubject = new Subject<CodesPromo[]>();
  codesPromo: CodesPromo[] = [];

  constructor() {
    this.getCodesPromoFromServer();
  }

  // Ajouter un nouveau codePromo
  addCodePromo(nouveauCodePromo: CodesPromo) {
    this.codesPromo.push(nouveauCodePromo);
    this.saveCodesPromoToServer();
    this.emitCodesPromoSubject();
  }

  emitCodesPromoSubject() {
    this.codesPromoSubject.next(this.codesPromo);
  }

  //Enregistre tous les codesPromo en BDD
  saveCodesPromoToServer() {
    firebase.database().ref('/codesPromo').set(this.codesPromo);
  }

  //Récupère liste entière des codesPromo.
  getCodesPromoFromServer() {
    firebase
      .database()
      .ref('/codesPromo')
      .on('value', (data: DataSnapshot) => {
        this.codesPromo = data.val() ? data.val() : [];
        this.emitCodesPromoSubject();
      });
  }

  //Récupère un seul codePromo
  getSingleCodePromo(id: number) {
    return new Promise<CodesPromo>((resolve, reject) => {
      firebase
        .database()
        .ref('/codesPromo/' + id)
        .once('value')
        .then(
          (data: DataSnapshot) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateCodePromo(index: number, codePromo: CodesPromo) {
    firebase
      .database()
      .ref('/codesPromo/' + index)
      .set({
        id: codePromo.id,
        nom: codePromo.nom,
        actif: codePromo.actif,
        code: codePromo.code,
        typeDeRemise: codePromo.typeDeRemise,
        montant: codePromo.montant,
        dateDeLancement: codePromo.dateDeLancement,
        dateDeFin: codePromo.dateDeFin,
        commentaire: codePromo.commentaire,
      });
  }

  // Supprimer un codePromo
  deleteCodePromoToServer(codePromo: CodesPromo, id: number) {
    firebase
      .database()
      .ref('/codesPromo/' + id)
      .remove();
    this.saveCodesPromoToServer();
    this.emitCodesPromoSubject();
  }
}
