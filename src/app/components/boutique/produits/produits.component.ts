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
  prodSub: Subscription;
  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    this.prodSub = this.produitsService.produitsSubject.subscribe((data) => {
      this.produits = data;
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
}
