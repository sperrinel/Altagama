export class Commandes {
  constructor(
    public id,
    public date,
    public client,
    public commande,
    public prixCommande,
    public fraisDeLivraison,
    public livraison,
    public codePromo,
    public dateDeTraitement,
    public traite,
    public commentaire
  ) {}
}
