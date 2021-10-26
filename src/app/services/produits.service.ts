
import { Injectable } from '@angular/core';
import { Produits } from '../modeles/produits';
import DataSnapshot = firebase.database.DataSnapshot;
import firebase from 'firebase';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  produitsSubject = new Subject<any[]>();
  produits: Produits[] = [];
  imageParDefaut: string =
    '';
  constructor() {
    this.getProduitsFromServer();
  }

  //Ajouter un nouveau exposant
  // addExposant(nouveauExposant: Exposant) {
  //   this.exposants.push(nouveauExposant);
  //   this.saveExposantsToServer();
  //   this.emitExposantsSubject();
  // }

  emitProduitsSubject() {
    this.produitsSubject.next(this.produits);
  }

  //Enregistre tous les exposants en BDD
  // saveExposantsToServer() {
  //   firebase.database().ref('/produits/vins').set(this.exposants);
  // }

  //Récupère liste entière des exposants.
  getProduitsFromServer() {
    firebase
      .database()
      .ref('/produits/vins')
      .on('value', (data: DataSnapshot) => {
        this.produits = data.val() ? data.val() : [];
        this.emitProduitsSubject();
      });
  }



  // uploadFile(file: File) {
  //   return new Promise((resolve, reject) => {
  //     const almostUniqueFileName = Date.now().toString();
  //     const upload = firebase
  //       .storage()
  //       .ref()
  //       .child('images/' + almostUniqueFileName + file.name)
  //       .put(file);
  //     upload.on(
  //       firebase.storage.TaskEvent.STATE_CHANGED,
  //       () => {
  //         console.log('Chargement…');
  //       },
  //       (error) => {
  //         console.log('Erreur de chargement ! : ' + error);
  //         reject();
  //       },
  //       () => {
  //         resolve(upload.snapshot.ref.getDownloadURL());
  //       }
  //     );
  //   });
  // }

  //Récupère un seul exposant
  // getSingleExposant(id: number) {
  //   return new Promise<Exposant>((resolve, reject) => {
  //     firebase
  //       .database()
  //       .ref('/produits/vins' + id)
  //       .once('value')
  //       .then(
  //         (data: DataSnapshot) => {
  //           resolve(data.val());
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }

  // updateExposant(idExposant: number, exposant: Exposant) {
  //   firebase
  //     .database()
  //     .ref('/produits/vins' + idExposant)
  //     .set({
  //       id: exposant.id,
  //       nom: exposant.nom,
  //       categorie: exposant.categorie,
  //       description: exposant.description,
  //       image: exposant.image,
  //       telephone: exposant.telephone,
  //       portable: exposant.portable,
  //       email: exposant.email,
  //       siteweb: exposant.siteweb,
  //     });
  // }

  //Supprimer un exposant
  // deleteExposantToServer(exposant: Exposant) {
  //   if (exposant.image != this.imageParDefaut && exposant.image != null) {
  //     const storageRef = firebase.storage().refFromURL(exposant.image);
  //     storageRef.delete().then(
  //       () => {
  //         console.log('Photo supprimé!');
  //       },
  //       (error) => {
  //         console.log('La suppression de la photo a échoué : ' + error);
  //       }
  //     );
  //   }
  //   const exposantIndexToRemove = this.exposants.findIndex((exposantEl) => {
  //     if (exposantEl === exposant) {
  //       return true;
  //     }
  //     return false;
  //   });
  //   this.exposants.splice(exposantIndexToRemove, 1);
  //   this.saveExposantsToServer();
  //   this.emitExposantsSubject();
  // }
}





