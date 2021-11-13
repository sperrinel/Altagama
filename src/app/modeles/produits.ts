import { Categorie } from './categorie';

export class Produits {
  constructor(
    public id: string,
    public nom: string,
    public categorie: number,
    public description: string,
    public image: string,
    public prix: number,
    public prixCarton: number,
    public bodega?: string,
    public alcool?: number,
    public service?: string,
    public stock?: number,
    public cepage?: string,
    public vignification?: string,
    public vieillissement?: string,
    public accompagnement?: string
  ) {}
}
