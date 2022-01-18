import { Adresse } from './adresse';
export class Users {
  constructor(
    public email: string,
    public role: string,
    public idUser: string,
    public prenom: string,
    public nom: string,
    public dateDeNaissance: string,
    public telephone: string,
    public adresseDeLivraison: Adresse,
    public adresseDeFacturation?: Adresse
  ) {}
}
