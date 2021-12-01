import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Panier } from 'src/app/modeles/panier';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';
import { ProduitsService } from 'src/app/services/produits.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  panier: Panier[] = [];
  produits: Produits[] = [];
  prodSub: Subscription;
  dataPanier = { nbArticle: 0, valeurTotale: 0 };

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    this.produits = this.produitsService.produits;
    this.prodSub = this.produitsService.produitsSubject.subscribe(
      (produits: Produits[]) => {
        this.produits = produits;
        console.log(this.produits);
      },
      (error: any) => {
        console.log('Erreur : ' + error);
      },
      () => {
        console.log('Observable complété');
      }
    );

    this.panier = this.panierService.panier;
    this.dataPanier = this.panierService.dataPanier;
    console.log(this.panier);
  }

  ajouterProduit(produit: Produits, quantite): void {
    this.panierService.ajouterProduitAuPanier(produit, quantite);
  }
  supprimerProduit(produit: Produits, retirerArticle?: boolean): void {
    this.panierService.supprimerProduitPanier(produit, retirerArticle);
  }
}
