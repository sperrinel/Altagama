export class Users {
  constructor(
    public email: string,
    public role?: string,
    public idUser?: string,
    public sexe?: string,
    public prenom?: string,
    public nom?: string,
    public dateDeNaissance?: string,
    public adresseDeLivraison?: string,
    public adresseDeFacturation?: string
  ) {}
}
