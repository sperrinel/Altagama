import { Component, OnInit } from '@angular/core';
import { Panier } from 'src/app/modeles/panier';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  panier: Panier[] = [];
  dataPanier = { nbArticle: 0, valeurTotale: 0 };
  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.panier = this.panierService.panier;
    this.dataPanier = this.panierService.dataPanier;
  }

  ajouterProduit(produit: Produits): void {
    this.panierService.ajouterProduitAuPanier(produit);
  }
  supprimerProduit(produit: Produits): void {
    this.panierService.supprimerProduitPanier(produit);
  }
}
