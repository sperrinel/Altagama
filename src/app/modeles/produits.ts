export class Produits {
  constructor(
    public id: string,
    public nom: string,
    public categorie: string,
    public description: string,
    public image: string,
    public prix: number,
    public bodega: string,
    public stock: number,
  ) {}
}
