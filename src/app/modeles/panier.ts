import { Produits } from './produits';

export interface Panier {
  quantite: number;
  produit: Produits;
  carton?: number;
}
