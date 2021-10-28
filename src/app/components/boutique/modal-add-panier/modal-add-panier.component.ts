import { Component, Input, OnInit } from '@angular/core';
import { Produits } from 'src/app/modeles/produits';

@Component({
  selector: 'app-modal-add-panier',
  templateUrl: './modal-add-panier.component.html',
  styleUrls: ['./modal-add-panier.component.css'],
})
export class ModalAddPanierComponent implements OnInit {
  @Input() produits: Produits[];
  constructor() {}

  ngOnInit(): void {}
}
