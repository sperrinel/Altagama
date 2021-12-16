import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
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

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService,
    private commandesService: CommandesService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isAuth = true;
        this.userSubscription = this.userService.usersSubject.subscribe(
          (data: Users[]) => {
            this.usersTab = data;
            console.log(this.usersTab);
            let dataUser = localStorage.getItem('user');
            let parseUser = JSON.parse(dataUser);
            let userEmail = parseUser.email;
            let userIndex = this.usersTab.findIndex(
              (element) => element.email == userEmail
            );
            this.userEnCours = this.usersTab[userIndex];
            console.log(this.userEnCours);
          }
        );
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
      this.usersTab = this.userService.users;
      let dataUser = localStorage.getItem('user');
      let parseUser = JSON.parse(dataUser);
      let userEmail = parseUser.email;
      let userIndex = this.usersTab.findIndex(
        (element) => element.email == userEmail
      );
      this.userEnCours = this.usersTab[userIndex];

      const commande = this.commandesService.creerCommandes(
        this.panier,
        this.userEnCours
      );

      this.commandesService.addcommande(commande);
    }
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
