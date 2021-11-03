import { Injectable } from '@angular/core';
import { Panier } from '../modeles/panier';
import { Produits } from '../modeles/produits';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  panier: Panier[];
  dataPanier = { nbArticle: 0, valeurTotale: 0 };
  constructor() {
    this.initPanier();
  }

  initPanier(): void {
    if (typeof localStorage !== 'undefined') {
      const panier = JSON.parse(localStorage.getItem('panier'));
      const dataPanier = JSON.parse(localStorage.getItem('dataPanier'));
      this.panier = panier ? panier : [];
      this.dataPanier = dataPanier
        ? dataPanier
        : { nbArticle: 0, valeurTotale: 0 };
    } else {
      this.panier = [];
      this.dataPanier = { nbArticle: 0, valeurTotale: 0 };
    }
  }

  ajouterProduitAuPanier(nouveauProduit: Produits, quantite?: number): void {
    let nbArticle = 1;

    const verifDoublon = this.panier.find(
      (element) => element.produit == nouveauProduit
    );
    if (quantite != null) {
      nbArticle = quantite;
    }
    if (verifDoublon) {
      verifDoublon.quantite += nbArticle;
    } else {
      const nouveauProduitAajouter = {
        quantite: nbArticle,
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('panier', JSON.stringify(this.panier));
      localStorage.setItem('dataPanier', JSON.stringify(this.dataPanier));
    }
  }

  supprimerProduitPanier(produitAsupprimer: Produits): void {
    const indexProduit = this.panier.findIndex(
      (element) => element.produit == produitAsupprimer
    );
    if (indexProduit !== -1) {
      if (this.panier[indexProduit].quantite > 1) {
        this.panier[indexProduit].quantite--;
      } else {
        this.panier.splice(indexProduit, 1);
      }
    }
    this.majPanier();
  }
}
