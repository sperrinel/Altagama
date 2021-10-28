import { Component, OnInit } from '@angular/core';
import { Panier } from 'src/app/modeles/panier';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  panier: Panier[] = [];
  dataPanier;
  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.panier = this.panierService.panier;
    this.dataPanier = this.panierService.dataPanier;
  }
}
