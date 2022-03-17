import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { Adresse } from 'src/app/modeles/adresse';
import { Panier } from 'src/app/modeles/panier';
import { Produits } from 'src/app/modeles/produits';
import { Users } from 'src/app/modeles/users';
import { CommandesService } from 'src/app/services/commandes.service';
import { PanierService } from 'src/app/services/panier.service';
import { ProduitsService } from 'src/app/services/produits.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  panier: Panier[] = [];
  isAuth: boolean = false;
  produits: Produits[] = [];
  prodSub: Subscription;
  dataPanier = { nbArticle: 0, valeurTotale: 0 };
  usersTab: Users[] = []; //Tableau de tous les users
  userEnCours: Users;
  userSubscription: Subscription;
  modePaiement: boolean = false;
  livraisonForm;
  toggleLivraison: boolean = undefined;
  autreAdresseCommentaire: boolean = false;
  validationFraisLivraison: boolean = false;
  pretPourPaiement: boolean = false;
  price: number; // montant du panier + frais de livraison
  frais: number; // Permet d'indiquer à l'admin les frais de livraison de la commande.

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService,
    private commandesService: CommandesService,
    private userService: UsersService,
    private router: Router,
    fb: FormBuilder
  ) {
    this.livraisonForm = fb.group({
      choixLivraison: ['', Validators.required],
      rue: [''],
      codePostal: [''],
      ville: [''],
      pays: [''],
      rueAutreAdresse: [''],
      codePostalAutreAdresse: [''],
      villeAutreAdresse: [''],
      paysAutreAdresse: [''],
      telephone: [''],
      nom: [''],
      prenom: [''],
      autreAdresseRenseignee: [''],
    });
  }

  ngOnInit(): void {
    this.modePaiement = false;
    this.autreAdresseCommentaire = false;
    this.pretPourPaiement = false;
    this.toggleLivraison = undefined;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('modif');

        this.isAuth = true;
        // let dataUser = localStorage.getItem('user');
        // let parseUser = JSON.parse(dataUser);
        // let userEmail = parseUser.email;
        // this.userSubscription = this.userService.usersSubject.subscribe(
        //   (data: Users[]) => {
        //     this.usersTab = data;
        //     console.log(this.usersTab);
        //     let userIndex = this.usersTab.findIndex(
        //       (element) => (element.email = userEmail)
        //     );
        //     this.userEnCours = this.usersTab[userIndex];
        //     console.log('panier : ' + this.userEnCours);
        //   }
        // );
      } else {
        this.isAuth = false;
      }
      this.userService.isAuth = this.isAuth;
      this.userService.emitIsAuthSubject();
    });
    this.produits = this.produitsService.produits;
    this.prodSub = this.produitsService.produitsSubject.subscribe(
      (produits: Produits[]) => {
        this.produits = produits;
      },
      (error: any) => {
        console.log('Erreur : ' + error);
      },
      () => {
        console.log('Observable complété');
      }
    );

    this.panier = this.panierService.panier;
    this.dataPanier = this.panierService.dataPanier;
  }

  ajouterProduit(produit: Produits, quantite): void {
    this.panierService.ajouterProduitAuPanier(produit, quantite);
  }
  supprimerProduit(produit: Produits, retirerArticle?: boolean): void {
    this.panierService.supprimerProduitPanier(produit, retirerArticle);
  }

  creerCommande() {
    if (this.isAuth != true) {
      this.router.navigate(['/login']);
    } else {
      this.getUser();
      if (this.userEnCours == undefined || this.userEnCours == null) {
        this.router.navigate(['/login']);
      } else {
        this.modePaiement = true;
      }

      //METHODE A LANCER AU MOMENT DE PAYER

      // this.usersTab = this.userService.users;
      // let dataUser = localStorage.getItem('user');
      // let parseUser = JSON.parse(dataUser);
      // let userEmail = parseUser.email;
      // let userIndex = this.usersTab.findIndex(
      //   (element) => element.email == userEmail
      // );
      // this.userEnCours = this.usersTab[userIndex];

      // const commande = this.commandesService.creerCommandes(
      //   this.panier,
      //   this.userEnCours
      // );

      // this.commandesService.addcommande(commande);
    }
  }

  getUser() {
    this.userEnCours = this.userService.getUser();
  }
  // getUser() {
  //   let users = this.userService.users;
  //   let dataUser = localStorage.getItem('user');
  //   let parseUser = JSON.parse(dataUser);
  //   console.log('parseUser = ', parseUser);
  //   let userEmail = parseUser.email;
  //   console.log('userEmail = ' + userEmail);
  //   console.log('tabUsers = ', users);
  //   let userIndex = users.findIndex((element) => userEmail == element.email);
  //   console.log('userIndex = ' + userIndex);

  //   console.log('user = ', users[userIndex]);
  //   this.userEnCours = users[userIndex];

  //   console.log(this.userEnCours);
  // }

  livraisonSelected() {
    this.autreAdresseCommentaire = false;
    this.toggleLivraison = true;
  }
  boutiqueSelected() {
    this.autreAdresseCommentaire = false;
    this.toggleLivraison = false;
  }

  autreAdresseSelected() {
    this.autreAdresseCommentaire = true;
    this.toggleLivraison = false;
  }

  onSubmitLivraisonForm() {
    this.validationFraisLivraison = true; //Ferme le contenu du panier et affiche le total TTC
    this.pretPourPaiement = true; //Affiche les boutons Paypal

    //1) ON RECUPERE LA SAISIE DE L'UTILISATEUR
    const formValue = this.livraisonForm.value;
    const autreAdresse = formValue['autreAdresse'];
    let adresseLivraisonClient = this.userEnCours.adresseDeLivraison;
    let autreAdresseClient = this.userEnCours.adresseDeLivraison;
    const choixLivraison = formValue['choixLivraison'];

    //2) SI L'UTILISATEUR CHOISI UNE LIVRAISON A DOMICILE, L'ADRESSE DE LIVRAISON SERA CELLE QU'IL A INDIQUÉ
    if (choixLivraison == 'livraison') {
      adresseLivraisonClient = new Adresse(
        formValue['rue'],
        formValue['codePostal'],
        formValue['ville'].toUpperCase(),
        formValue['pays'].toUpperCase()
      );
      //3) SI L'UTILISATEUR CHOISI UNE AUTRE ADRESSE, LA VARIABLE autreAdresseClient NE CONTIENDRA PLUS L'ADRESSE PAR DEFAUT MAIS BIEN CELLE INDIQUÉ
      // ---> Pour la commande il faudra faire en sorte que si l'adresseDeLivraison et autreAdresse sont différent, alors l'adresse de livraison sera égale à l'autreAdresse
      // ---> A la fin de l'achat, autreAdresse redeviendra adresseDeLivraison (l'adresse par défaut du client).
    } else if (choixLivraison == 'boutique') {
      autreAdresseClient = new Adresse(
        '35 rue du Petit Savine',
        44570,
        'TRIGNAC',
        'FRANCE'
      );

      this.userEnCours.autreAdresse = autreAdresseClient;
    } else if (choixLivraison == 'autreAdresse') {
      autreAdresseClient = new Adresse(
        formValue['rueAutreAdresse'],
        formValue['codePostalAutreAdresse'],
        formValue['villeAutreAdresse'].toUpperCase(),
        formValue['paysAutreAdresse'].toUpperCase()
      );

      // const telephone = formValue['telephone'];
      // const prenom = formValue['prenom'];
      // const nom = formValue['nom'];
    }

    //4) ON MET A JOUR L'UTILISATEUR AVEC L'autreAdresseClient en BDD ainsi que les autres informations ayant été potentiellement modifiées pendant le remplissage du formulaire.
    const updateUserAdresseDeLivraison = new Users(
      this.userEnCours.email,
      this.userEnCours.role,
      this.userEnCours.idUser,
      this.userEnCours.prenom,
      this.userEnCours.nom.toUpperCase(),
      this.userEnCours.dateDeNaissance,
      this.userEnCours.telephone,
      this.userEnCours.adresseDeLivraison,
      this.userEnCours.adresseDeFacturation,
      autreAdresseClient
    );

    this.userService.updateUser(updateUserAdresseDeLivraison);

    //5) ON CALCUL LES FRAIS DE LIVRAISON, POUR CELA ON A BESOIN DE CONNAITRE LE CHOIX DE LIVRAISON + L'ADRESSE DE L'UTILISATEUR + LE CONTENU DU PANIER (ex: + de 300€ d'achat = frais offert)
    let fraisDeLivraison = this.majorationFraisLivraison(
      choixLivraison,
      this.userEnCours,
      this.dataPanier
    );

    //6) ON RENSEIGNE PRICE AVEC LE MONTANT TOTAL POUR EFFECTUER LE PAIEMENT PLUS TARD AVEC PAYPAL
    this.price = this.dataPanier.valeurTotale + fraisDeLivraison;
    this.frais = fraisDeLivraison;

    //7) ON CREER LA COMMANDE
    // const commande = this.commandesService.creerCommandes(
    //   this.panierService.panier,
    //   this.price,
    //   this.userEnCours,
    //   this.frais
    // );

    //8) ON L'AJOUTE A LA LISTE DES COMMANDES
    // this.commandesService.addcommande(commande);
    this.userEnCours.autreAdresse = this.userEnCours.adresseDeLivraison; //Permettra de distinguer sur autreAdresse != d'adresseDeLivraison pour indiquer sur la commande où il faut livrer.
  }

  majorationFraisLivraison(
    choixLivraison: string,
    userEnCours: Users,
    dataPanier: any
  ): number {
    let valeurPanier: number = dataPanier.valeurTotale;
    let nbArticlePanier: number = dataPanier.nbArticle;
    let fraisDeLivraison: number = 0;
    if (
      choixLivraison == 'boutique' ||
      (choixLivraison == 'livraison' && valeurPanier >= 300) ||
      (choixLivraison == 'livraison' && nbArticlePanier >= 40) ||
      (choixLivraison == 'autreAdresse' && valeurPanier >= 300) ||
      (choixLivraison == 'autreAdresse' && nbArticlePanier >= 40)
    ) {
      return fraisDeLivraison;
    } else {
      return this.checkCodePostal(userEnCours, nbArticlePanier, choixLivraison);
    }
  }

  // Autre adresse: zone avec commentaire /!\ /!\
  checkCodePostal(
    userEnCours,
    nbArticlePanier: number,
    choixLivraison: string
  ): number {
    this.getUser(); //Subscription serait mieux.
    let codePostal;
    if (choixLivraison == 'livraison') {
      codePostal = userEnCours.adresseDeLivraison.codePostal;
    } else if (choixLivraison == 'autreAdresse') {
      codePostal = userEnCours.autreAdresse.codePostal;
    }

    let frais = 0;
    let codesPostauxTab: { code: number; frais: number }[] = [
      {
        code: 44000,
        frais: 9,
      },
      {
        code: 44024,
        frais: 9,
      },
      {
        code: 44035,
        frais: 9,
      },
      {
        code: 44074,
        frais: 9,
      },
      {
        code: 44101,
        frais: 9,
      },
      {
        code: 44162,
        frais: 9,
      },
      {
        code: 44166,
        frais: 9,
      },
      {
        code: 44009,
        frais: 9,
      },
      {
        code: 44020,
        frais: 9,
      },
      {
        code: 44150,
        frais: 9,
      },
      {
        code: 44171,
        frais: 9,
      },
      {
        code: 44020,
        frais: 9,
      },
      {
        code: 44120,
        frais: 9,
      },
      {
        code: 44980,
        frais: 9,
      },
      {
        code: 44204,
        frais: 9,
      },
      {
        code: 44094,
        frais: 9,
      },
      {
        code: 44109,
        frais: 9,
      },
      {
        code: 44018,
        frais: 9,
      },
      {
        code: 44047,
        frais: 9,
      },
      {
        code: 44109,
        frais: 9,
      },
      {
        code: 44172,
        frais: 9,
      },
      {
        code: 44190,
        frais: 9,
      },
      {
        code: 44114,
        frais: 9,
      },
      {
        code: 44143,
        frais: 9,
      },
      {
        code: 44109,
        frais: 9,
      },
      {
        code: 44074,
        frais: 9,
      },
      {
        code: 44026,
        frais: 9,
      },
      {
        code: 44215,
        frais: 9,
      },
      {
        code: 44420,
        frais: 4,
      },
      {
        code: 44350,
        frais: 4,
      },
      {
        code: 44500,
        frais: 4,
      },
      {
        code: 44740,
        frais: 4,
      },
      {
        code: 44510,
        frais: 4,
      },
      {
        code: 44117,
        frais: 4,
      },
      {
        code: 44410,
        frais: 4,
      },
      {
        code: 44420,
        frais: 4,
      },
      {
        code: 44490,
        frais: 4,
      },
      {
        code: 44600,
        frais: 4,
      },
      {
        code: 44380,
        frais: 4,
      },
      {
        code: 44570,
        frais: 4,
      },
    ];

    let index = codesPostauxTab.findIndex(
      (element) => element.code == codePostal
    );

    if (index !== -1) {
      frais = codesPostauxTab[index].frais;
    } else {
      if (nbArticlePanier <= 6) {
        frais = 10;
      } else if (nbArticlePanier >= 7 && nbArticlePanier <= 12) {
        frais = 15;
      } else if (nbArticlePanier >= 13 && nbArticlePanier <= 18) {
        frais = 20;
      } else {
        frais = 25;
      }
    }
    return frais;
  }
}

// import { Component, Input, OnInit } from '@angular/core';
// import firebase from 'firebase';
// import { Subscription } from 'rxjs';
// import { Panier } from 'src/app/modeles/panier';
// import { Produits } from 'src/app/modeles/produits';
// import { Users } from 'src/app/modeles/users';
// import { CommandesService } from 'src/app/services/commandes.service';
// import { PanierService } from 'src/app/services/panier.service';
// import { ProduitsService } from 'src/app/services/produits.service';
// import { UsersService } from 'src/app/services/users.service';

// @Component({
//   selector: 'app-panier',
//   templateUrl: './panier.component.html',
//   styleUrls: ['./panier.component.css'],
// })
// export class PanierComponent implements OnInit {
//   panier: Panier[] = [];
//   produits: Produits[] = [];
//   prodSub: Subscription;
//   dataPanier = { nbArticle: 0, valeurTotale: 0 };
//   isAuth : boolean;
//   usersTab: Users[] = []; //Tableau de tous les users
//   userEnCours: Users;
//   userSubscription: Subscription;

//   constructor(
//     private produitsService: ProduitsService,
//     private panierService: PanierService,
//     private commandesService : CommandesService,
//     private users: UsersService,
//   ) {}

//   ngOnInit(): void {
//     this.produits = this.produitsService.produits;
//     this.prodSub = this.produitsService.produitsSubject.subscribe(
//       (produits: Produits[]) => {
//         this.produits = produits;
//         console.log(this.produits);
//       },
//       (error: any) => {
//         console.log('Erreur : ' + error);
//       },
//       () => {
//         console.log('Observable complété');
//       }
//     );

//     this.panier = this.panierService.panier;
//     this.dataPanier = this.panierService.dataPanier;
//     console.log(this.panier);

// }

//   ajouterProduit(produit: Produits, quantite): void {
//     this.panierService.ajouterProduitAuPanier(produit, quantite);
//   }
//   supprimerProduit(produit: Produits, retirerArticle?: boolean): void {
//     this.panierService.supprimerProduitPanier(produit, retirerArticle);
//   }
