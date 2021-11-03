import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';
import { ProduitsService } from 'src/app/services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit, OnDestroy {
  produits: any[] = [];
  // produits = [
  //   {
  //     id: 5,
  //     nom: 'Vin test',
  //     description: 'description test',
  //     prix: 12.5,
  //   },
  // ];

  prodSub: Subscription;
  pageEnCours = 0;
  pages = [0, 1, 2, 3];
  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    this.prodSub = this.produitsService.produitsSubject.subscribe((data) => {
      this.produits = this.produitsService.afficherProduitParPage(
        this.pageEnCours
      );
    });
    this.produitsService.emitProduitsSubject();
  }

  ajouterAuPanier(produit: Produits): void {
    this.panierService.ajouterProduitAuPanier(produit);
  }

  supprimerProduitPanier(produit) {
    this.panierService.supprimerProduitPanier(produit);
  }

  ngOnDestroy(): void {
    this.prodSub.unsubscribe();
  }

  changerDePage(numPage: number): void {
    const prod = this.produitsService.afficherProduitParPage(numPage);
    if (prod) {
      this.produits = prod;
      this.pageEnCours = numPage;
    }
  }

  pageSuivante(): void {
    const nouvellePageEnCours = this.pageEnCours + 1;
    const prod =
      this.produitsService.afficherProduitParPage(nouvellePageEnCours);
    if (prod) {
      this.produits = prod;
      this.pageEnCours = nouvellePageEnCours;
    }
  }

  pagePrecedente(): void {
    const nouvellePageEnCours = this.pageEnCours - 1;
    const prod =
      this.produitsService.afficherProduitParPage(nouvellePageEnCours);
    if (prod) {
      this.produits = prod;
      this.pageEnCours = nouvellePageEnCours;
    }
  }
}
