import { Component, Input, OnInit } from '@angular/core';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-modal-add-panier',
  templateUrl: './modal-add-panier.component.html',
  styleUrls: ['./modal-add-panier.component.css'],
})
export class ModalAddPanierComponent implements OnInit {
  @Input() produits: Produits[];
  nbArticle: number = 1;
  constructor(private panierService: PanierService) {}

  ngOnInit(): void {}

  ajoutArticle() {
    this.nbArticle++;
  }
  supprimerArticle() {
    this.nbArticle--;
  }

  retour() {
    this.nbArticle = 1;
  }

  validerPanier(produit: Produits, quantite: number): void {
    this.panierService.ajouterProduitAuPanier(produit, quantite);
    this.retour();
  }
}
