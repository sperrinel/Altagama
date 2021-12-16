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
      verifDoublon.carton = Math.floor(verifDoublon.quantite / 6);
    } else {
      const nouveauProduitAajouter = {
        quantite: nbArticle,
        produit: nouveauProduit,
        carton: Math.floor(nbArticle / 6),
      };
      this.panier.push(nouveauProduitAajouter);
    }
    this.majPanier();
  }

  // majPanier() {
  //   let nbArticle = 0;
  //   let valeurTotale = 0;
  //   this.panier.forEach((element) => {
  //     nbArticle += element.quantite;
  //     valeurTotale += element.produit.prix * element.quantite;
  //   });
  //   this.dataPanier.nbArticle = nbArticle;
  //   this.dataPanier.valeurTotale = valeurTotale;
  //   if (typeof localStorage !== 'undefined') {
  //     localStorage.setItem('panier', JSON.stringify(this.panier));
  //     localStorage.setItem('dataPanier', JSON.stringify(this.dataPanier));
  //   }
  // }
  majPanier() {
    let nbArticle = 0;
    let valeurTotale = 0;
    let totalPrixArticlesHorsCarton = 0;
    let prixCarton = 0;
    this.panier.forEach((element) => {
      //Article total dans le panier
      nbArticle += element.quantite;
      //Montant total des articles hors carton
      totalPrixArticlesHorsCarton +=
        (element.quantite - 6 * element.carton) * element.produit.prix;
      //Montant total des cartons du panier
      prixCarton += element.produit.prixCarton * element.carton;
      valeurTotale = prixCarton + totalPrixArticlesHorsCarton;
    });
    this.dataPanier.nbArticle = nbArticle;
    this.dataPanier.valeurTotale = valeurTotale;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('panier', JSON.stringify(this.panier));
      localStorage.setItem('dataPanier', JSON.stringify(this.dataPanier));
    }
  }

  supprimerProduitPanier(
    produitAsupprimer: Produits,
    retirerArticle?: boolean
  ): void {
    //Connaître l'index du produit passé en paramètre
    const indexProduit = this.panier.findIndex(
      (element) => element.produit == produitAsupprimer
    );
    console.log(retirerArticle);
    //Si on ne dit pas explicitement qu'on retire tout + si l'index existe dans le tableau + que la
    //quantite est supérieur à 1, on décrémente de 1 sinon on supprime l'article du tableau
    if (
      retirerArticle !== true &&
      indexProduit !== -1 &&
      this.panier[indexProduit].quantite > 1
    ) {
      this.panier[indexProduit].quantite--;
      this.panier[indexProduit].carton = Math.floor(
        this.panier[indexProduit].quantite / 6
      );

      this.majPanier();
    } else {
      this.panier.splice(indexProduit, 1);
      this.majPanier();
    }
  }

  //Après le paiement, réinitialise le panier.
  removeElementOfCart(): void {
    this.panier = [];
    console.log('this.panier = ' + this.panier);
    this.majPanier();
  }
}
