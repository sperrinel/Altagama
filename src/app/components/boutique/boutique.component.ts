import { ProduitsService } from './../../services/produits.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Produits } from 'src/app/modeles/produits';


@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent implements OnInit, OnDestroy {

  produits : Produits [] = [];
  prodSub : Subscription;
  constructor(private produitsService : ProduitsService) { }


  ngOnInit(): void {
    this.prodSub = this.produitsService.produitsSubject.subscribe(
      (data) => {
        this.produits = data;
      });
     this.produitsService.emitProduitsSubject();
  }

  ngOnDestroy(): void {
    this.prodSub.unsubscribe();
  }

}
