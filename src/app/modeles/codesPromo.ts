export class CodesPromo {
  constructor(
    public id: string,
    public nom: string,
    public actif: boolean,
    public code: string,
    public typeDeRemise: string,
    public montant: number,
    public dateDeLancement,
    public dateDeFin,
    public commentaire?: string
  ) {}
}
