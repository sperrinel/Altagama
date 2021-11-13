import { ProduitsService } from 'src/app/services/produits.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produits } from 'src/app/modeles/produits';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  produits: Produits[];
  produitsSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private produitsService: ProduitsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((request) => {
      this.produitsSub = this.produitsService.produitsSubject.subscribe(
        (data: Produits[]) => {
          const prod = data.filter((produit) => {
            return produit.categorie == +request.id;
          });
          this.produits = prod;
        }
      );
      this.produitsService.emitProduitsSubject();
    });
  }

  ngOnDestroy(): void {
    this.produitsSub.unsubscribe();
  }
}
