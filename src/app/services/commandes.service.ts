import { Commandes } from './../modeles/commandes';
import { PanierService } from './panier.service';
import { Injectable } from '@angular/core';
import { Users } from '../modeles/users';
import { Panier } from '../modeles/panier';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root',
})
export class CommandesService {
  constructor(private panierService: PanierService) {
    this.getcommandesFromServer();
  }

  commandesSubject = new Subject<Commandes[]>();
  commandes: Commandes[] = [];

  // Ajouter une nouvelle commande
  addcommande(nouvelleCommande: Commandes) {
    this.commandes.push(nouvelleCommande);
    this.saveCommandesToServer();
    this.emitCommandesSubject();
    //Réinitialise le panier
    this.panierService.removeElementOfCart();
  }

  emitCommandesSubject() {
    this.commandesSubject.next(this.commandes);
  }

  //Enregistre tous les commandes en BDD
  saveCommandesToServer() {
    firebase.database().ref('/commandes').set(this.commandes);
  }

  //Récupère liste entière des commandes.
  getcommandesFromServer() {
    firebase
      .database()
      .ref('/commandes')
      .on('value', (data: DataSnapshot) => {
        this.commandes = data.val() ? data.val() : [];
        this.emitCommandesSubject();
      });
  }

  //Récupère un seul commande
  getSinglecommande(id: number) {
    return new Promise<Commandes>((resolve, reject) => {
      firebase
        .database()
        .ref('/commandes' + id)
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

  updatecommande(idcommande: number, commande: Commandes) {
    firebase
      .database()
      .ref('/commandes' + idcommande)
      .set({
        id: commande.id,
        client: commande.client,
        commande: commande.prixCommande,
        livraison: commande.livraison,
        codePromo: commande.codePromo,
      });
  }

  // Supprimer une commande
  deleteCommandeToServer(commande: Commandes, idCommande: number) {
    firebase
      .database()
      .ref('/commandes' + idCommande)
      .remove();

    // firebase
    //   .database()
    //   .ref('/commandes/vins/' + idExposant)
    //   .remove();
    // const commandeIndexToRemove = this.commandes.findIndex((commandeEl) => {
    //   if (commandeEl === commande) {
    //     return true;
    //   }

    //   return false;
    // });
    // console.log('commandeIndexToRemove' + commandeIndexToRemove);
    this.commandes.splice(idCommande, 1);
    this.saveCommandesToServer();
    this.emitCommandesSubject();
  }

  creerCommandes(panier: Panier[], user: Users) {
    const id = this.generateUniqueID();
    const date = new Date().toLocaleString();
    const client = user;
    const contenuCommande = panier;
    const prixCommande = this.panierService.dataPanier.valeurTotale;
    const livraison = 'Guérande';
    const codePromo = 'CODE2021';

    const commande = new Commandes(
      id,
      date,
      client,
      contenuCommande,
      prixCommande,
      livraison,
      codePromo
    );

    return commande;
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
