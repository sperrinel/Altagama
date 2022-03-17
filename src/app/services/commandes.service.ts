import { Commandes } from './../modeles/commandes';
import { PanierService } from './panier.service';
import { Injectable } from '@angular/core';
import { Users } from '../modeles/users';
import { Panier } from '../modeles/panier';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { Adresse } from '../modeles/adresse';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CommandesService {
  commandesSubject = new Subject<Commandes[]>();
  commandes: Commandes[] = [];

  constructor(
    private panierService: PanierService,
    private datepipe: DatePipe
  ) {
    this.getcommandesFromServer();
  }

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
        .ref('/commandes/' + id)
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

  //En fonction du mode de livraison des frais supplémentaire peuvent s'appliquer.
  majorationFraisLivraison() {}

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

  creerCommandes(panier: Panier[], price, user: Users, frais) {
    let livraison: Adresse;

    if (
      user.adresseDeLivraison.rue == user.autreAdresse.rue &&
      user.adresseDeLivraison.codePostal == user.autreAdresse.codePostal
    ) {
      livraison = user.adresseDeLivraison;
    } else {
      livraison = user.autreAdresse;
    }

    const id = this.generateUniqueID();
    const date = this.datepipe.transform(Date.now(), 'dd/MM/yyyy hh:mm:ss');
    const client = user;
    const contenuCommande = panier;
    const prixCommande = price;
    const fraisDeLivraison = frais;

    const codePromo = '';
    const dateDeTraitement = '';
    const traite = 'Non';
    const commentaire = '';
    const archivage = false;

    const commande = new Commandes(
      id,
      date,
      client,
      contenuCommande,
      prixCommande,
      fraisDeLivraison,
      livraison,
      codePromo,
      dateDeTraitement,
      traite,
      commentaire,
      archivage
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
