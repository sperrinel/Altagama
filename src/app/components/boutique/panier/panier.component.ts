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
  toggleLivraison: boolean = false;

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
      telephone: [''],
      nom: [''],
      prenom: [''],
    });
  }

  ngOnInit(): void {
    this.modePaiement = false;
    this.toggleLivraison = false;
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
        console.log(this.produits);
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
    console.log(this.panier);
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
      this.modePaiement = true;
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

  livraisonSelected() {
    let users = this.userService.users;
    let dataUser = localStorage.getItem('user');
    let parseUser = JSON.parse(dataUser);
    let userEmail = parseUser.email;
    let userIndex = users.findIndex((element) => (element.email = userEmail));
    this.userEnCours = users[userIndex];

    this.toggleLivraison = true;
  }
  boutiqueSelected() {
    this.toggleLivraison = false;
  }

  onSubmitLivraisonForm() {
    const formValue = this.livraisonForm.value;
    const choixLivraison = formValue['choixLivraison'];
    if (choixLivraison == 'livraison') {
      const adresseLivraisonClient = new Adresse(
        formValue['rue'],
        formValue['codePostal'],
        formValue['ville'],
        formValue['pays']
      );
      const telephone = formValue['telephone'];
      const prenom = formValue['prenom'];
      const nom = formValue['nom'];
      const updateUserAdresseDeLivraison = new Users(
        this.userEnCours.email,
        this.userEnCours.role,
        this.userEnCours.idUser,
        prenom,
        nom,
        this.userEnCours.dateDeNaissance,
        telephone,
        adresseLivraisonClient,
        this.userEnCours.adresseDeFacturation
      );

      this.userService.updateUser(updateUserAdresseDeLivraison);
    }
    let fraisDeLivraison = this.majorationFraisLivraison(
      choixLivraison,
      this.userEnCours,
      this.dataPanier
    );
    console.log('fraisDeLivraison = ' + fraisDeLivraison);
  }

  majorationFraisLivraison(
    choixLivraison: string,
    userEnCours: Users,
    dataPanier: any
  ) {
    let valeurPanier: number = dataPanier.valeurTotale;
    let fraisDeLivraison: number = 0;
    if (choixLivraison == 'boutique') {
      console.log(
        '0€ de frais de livraison car vous avec choisi un livraison en ' +
          choixLivraison +
          '.'
      );
      return fraisDeLivraison;
    } else if (choixLivraison == 'livraison') {
      if (valeurPanier >= 300) {
        return fraisDeLivraison;
      } else {
        this.checkCodePostal(userEnCours.adresseDeLivraison.codePostal);
        console.log(
          "Vous avez choisi '" +
            choixLivraison +
            "' des frais supplémentaires peuvent être engendrés."
        );
      }
    } else {
      console.log('Oops, bug :-(');
    }
  }
  // 40 bouteilles = gratuit
  // Nantes = 9 euros
  // Presqu'île = 4 euros
  // 300 euors = frais offert
  // 1 à 6 bouteilles = 10 euros
  // 7 à 12 bouteilles = 15 euros
  // 13 à 18 bouteilles = 20 euros
  // montant de la commande, si 300 ou sup = offert
  // code postal, si local = 4 ou 9 euros
  // sinon calcul nb de bouteille(s)
  // Autre adresse: zone avec commentaire /!\ /!\
  checkCodePostal(CP: number): number {
    let frais = 0;
    let codesPostauxTab: [
      {
        code: 44000;
        frais: 9;
      },
      {
        code: 44024;
        frais: 9;
      },
      {
        code: 44035;
        frais: 9;
      },
      {
        code: 44074;
        frais: 9;
      },
      {
        code: 44101;
        frais: 9;
      },
      {
        code: 44162;
        frais: 9;
      },
      {
        code: 44166;
        frais: 9;
      },
      {
        code: 44009;
        frais: 9;
      },
      {
        code: 44020;
        frais: 9;
      },
      {
        code: 44150;
        frais: 9;
      },
      {
        code: 44171;
        frais: 9;
      },
      {
        code: 44020;
        frais: 9;
      },
      {
        code: 44047;
        frais: 9;
      },
      {
        code: 44120;
        frais: 9;
      },
      {
        code: 4498;
        frais: 9;
      },
      {
        code: 44204;
        frais: 9;
      },
      {
        code: 44094;
        frais: 9;
      },
      {
        code: 44109;
        frais: 9;
      },
      {
        code: 44018;
        frais: 9;
      },
      {
        code: 44047;
        frais: 9;
      },
      {
        code: 44109;
        frais: 9;
      },
      {
        code: 44172;
        frais: 9;
      },
      {
        code: 4490;
        frais: 9;
      },
      {
        code: 44114;
        frais: 9;
      },
      {
        code: 44143;
        frais: 9;
      },
      {
        code: 4494;
        frais: 9;
      },
      {
        code: 44109;
        frais: 9;
      },
      {
        code: 44074;
        frais: 9;
      },
      {
        code: 44026;
        frais: 9;
      },
      {
        code: 44215;
        frais: 9;
      }
    ];
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
