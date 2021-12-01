import { Injectable } from '@angular/core';
import { Produits } from '../modeles/produits';
import DataSnapshot = firebase.database.DataSnapshot;
import firebase from 'firebase';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  produitsSubject = new Subject<Produits[]>();
  nbDeProduitsParPage = 1;
  produits: Produits[] = [];
  imageParDefaut: string =
    'https://firebasestorage.googleapis.com/v0/b/altagama-9d227.appspot.com/o/images%2FAltagama-vin-par-defaut.png?alt=media&token=e6cb51b9-13e5-431b-9e89-233fa26ab308';
  constructor() {
    this.getProduitsFromServer();
  }

  // Ajouter un nouveau produit
  addProduit(nouveauProduit: Produits) {
    this.produits.push(nouveauProduit);
    this.saveProduitsToServer();
    this.emitProduitsSubject();
  }

  emitProduitsSubject() {
    this.produitsSubject.next(this.produits);
  }

  //Enregistre tous les produits en BDD
  saveProduitsToServer() {
    firebase.database().ref('/produits/vins').set(this.produits);
  }

  //Récupère liste entière des produits.
  getProduitsFromServer() {
    firebase
      .database()
      .ref('/produits/vins')
      .on('value', (data: DataSnapshot) => {
        this.produits = data.val() ? data.val() : [];
        this.emitProduitsSubject();
      });
  }

  uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      // const almostUniqueFileName = Date.now().toString();
      const upload = firebase
        .storage()
        .ref()
        .child('images/vins/' + file.name)
        .put(file);
      upload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          console.log('Chargement…');
        },
        (error) => {
          console.log('Erreur de chargement ! : ' + error);
          reject();
        },
        () => {
          resolve(upload.snapshot.ref.getDownloadURL());
        }
      );
    });
  }

  //Récupère un seul produit
  getSingleProduit(id: number) {
    return new Promise<Produits>((resolve, reject) => {
      firebase
        .database()
        .ref('/produits/vins/' + id)
        .once('value')
        .then(
          (data: DataSnapshot) => {
            console.log(data.val);

            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateProduit(idProduit: number, produit: Produits) {
    firebase
      .database()
      .ref('/produits/vins/' + idProduit)
      .set({
        id: produit.id,
        nom: produit.nom,
        categorie: produit.categorie,
        description: produit.description,
        image: produit.image,
        prix: produit.prix,
        prixCarton: produit.prixCarton,
        bodega: produit.bodega,
        alcool: produit.alcool,
        service: produit.service,
        stock: produit.stock,
        cepage: produit.cepage,
        vignification: produit.vignification,
        vieillissement: produit.vieillissement,
        accompagnement: produit.accompagnement,
      });
  }

  // Supprimer un produit
  deleteProduitToServer(produit: Produits, idExposant: number) {
    if (produit.image != this.imageParDefaut && produit.image != null) {
      const storageRef = firebase.storage().refFromURL(produit.image);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimé!');
        },
        (error) => {
          console.log('La suppression de la photo a échoué : ' + error);
        }
      );
    }
    // firebase
    //   .database()
    //   .ref('/produits/vins/' + idExposant)
    //   .remove();
    // const produitIndexToRemove = this.produits.findIndex((produitEl) => {
    //   if (produitEl === produit) {
    //     return true;
    //   }

    //   return false;
    // });
    // console.log('produitIndexToRemove' + produitIndexToRemove);
    this.produits.splice(idExposant, 1);
    this.saveProduitsToServer();
    this.emitProduitsSubject();
  }

  afficherProduitParPage(numPage: number): Produits[] {
    const nbTotalDePage = this.produits.length / this.nbDeProduitsParPage;
    if (numPage > 0 || numPage < nbTotalDePage) {
      const resultatProduit = this.produits.slice(
        numPage * this.nbDeProduitsParPage,
        (numPage + 1) * this.nbDeProduitsParPage
      );
      return resultatProduit;
    }
    return null;
  }
}
