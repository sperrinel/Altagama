import { Component, Input, OnInit } from '@angular/core';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-modal-add-panier',
  templateUrl: './modal-add-panier.component.html',
  styleUrls: ['./modal-add-panier.component.css'],
})
export class ModalAddPanierComponent implements OnInit {
  // @Input() produits: Produits[];
  // nbArticle: number = 1;
  // nbCarton: number = 0;
  // constructor(private panierService: PanierService) {}

  // ngOnInit(): void {}

  // ajoutArticle() {
  //   this.nbArticle++;
  //   if (this.nbArticle >= 6) {
  //     this.nbCarton = Math.floor(this.nbArticle / 6);
  //   }
  // }
  // supprimerArticle() {
  //   this.nbArticle--;
  //   if (this.nbArticle >= 6) {
  //     this.nbCarton = Math.floor(this.nbArticle / 6);
  //   } else if (this.nbArticle < 6 && this.nbCarton > 0) {
  //     this.nbCarton = 0;
  //   }
  // }

  // retour() {
  //   this.nbArticle = 1;
  //   this.nbCarton = 0;
  // }

  // ajoutCarton() {
  //   if (this.nbArticle == 1) {
  //     this.nbArticle = 6;
  //   } else {
  //     this.nbArticle += 6;
  //   }
  //   this.nbCarton++;
  // }

  // supprimerCarton() {
  //   this.nbCarton--;
  //   if (this.nbArticle > 6) {
  //     this.nbArticle -= 6;
  //   } else {
  //     this.nbArticle = 1;
  //   }
  // }

  // validerPanier(produit: Produits, quantite: number): void {
  //   this.panierService.ajouterProduitAuPanier(produit, quantite);
  //   this.retour();
  // }
  @Input() produits: Produits[];
  nbArticle: number = 0;
  nbCarton: number = 0;
  constructor(private panierService: PanierService) {}

  ngOnInit(): void {}

  ajoutArticle() {
    this.nbArticle++;
    if (this.nbArticle >= 6) {
      this.nbCarton++;
      this.nbArticle = 0;
    }
  }
  supprimerArticle() {
    this.nbArticle--;
  }

  retour() {
    this.nbArticle = 0;
    this.nbCarton = 0;
  }

  ajoutCarton() {
    this.nbCarton++;
  }

  supprimerCarton() {
    this.nbCarton--;
  }

  validerPanier(produit: Produits, nbArticle: number, nbCarton): void {
    let quantite = nbArticle + nbCarton * 6;
    this.panierService.ajouterProduitAuPanier(produit, quantite);
    this.retour();
  }
}
