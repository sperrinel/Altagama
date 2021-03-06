import { Component, Input, OnInit } from '@angular/core';
import { Produits } from 'src/app/modeles/produits';

@Component({
  selector: 'app-single-produit',
  templateUrl: './single-produit.component.html',
  styleUrls: ['./single-produit.component.css'],
})
export class SingleProduitComponent implements OnInit {
  @Input() produits: Produits[];
  constructor() {}

  ngOnInit(): void {}
}
