import { Injectable } from '@angular/core';
import { Panier } from '../modeles/panier';
import { Produits } from '../modeles/produits';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  panier: Panier[] = [];
  dataPanier = { nbArticle: 0, valeurTotale: 0 };
  constructor() {}

  ajouterProduitAuPanier(nouveauProduit: Produits): void {
    const verifDoublon = this.panier.find(
      (element) => element.produit == nouveauProduit
    );
    if (verifDoublon) {
      verifDoublon.quantite++;
    } else {
      const nouveauProduitAajouter = {
        quantite: 1,
        produit: nouveauProduit,
      };
      this.panier.push(nouveauProduitAajouter);
    }
    this.majPanier();
  }

  majPanier() {
    let nbArticle = 0;
    let valeurTotale = 0;
    this.panier.forEach((element) => {
      nbArticle += element.quantite;
      valeurTotale += element.produit.prix * element.quantite;
    });
    this.dataPanier.nbArticle = nbArticle;
    this.dataPanier.valeurTotale = valeurTotale;
  }

  supprimerProduitPanier(produitAsupprimer: Produits): void {
    const indexProduit = this.panier.findIndex(
      (element) => element.produit == produitAsupprimer
    );
    if (indexProduit) {
      if (this.panier[indexProduit].quantite > 1) {
        this.panier[indexProduit].quantite--;
      } else {
        this.panier.splice(indexProduit, 1);
      }
    }
    this.majPanier();
  }
}
