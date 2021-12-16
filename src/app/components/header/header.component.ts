import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Panier } from 'src/app/modeles/panier';
import { PanierService } from 'src/app/services/panier.service';
import { UsersService } from 'src/app/services/users.service';
import * as $ from 'jQuery';
import firebase from 'firebase';
import { CategorieService } from 'src/app/services/categorie.service';
import { Categorie } from 'src/app/modeles/categorie';
import { Subscription } from 'rxjs';
import { Users } from 'src/app/modeles/users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false;
  usersTab: Users[] = []; //Tableau de tous les users
  userEnCours: Users;
  userSubscription: Subscription;
  panier: Panier[] = [];
  dataPanier;
  categories: Categorie[];
  categorieSubscription: Subscription;
  constructor(
    private categorieService: CategorieService,
    private panierService: PanierService,
    private users: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.panier = this.panierService.panier;
    this.dataPanier = this.panierService.dataPanier;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
      this.users.isAuth = this.isAuth;
      this.users.emitIsAuthSubject();
    });
    this.categorieSubscription =
      this.categorieService.categorieSubject.subscribe((data: Categorie[]) => {
        this.categories = data;
      });
    this.categorieService.emitCategoriessSubject();
    if ((this.isAuth = true)) {
      let dataUser = localStorage.getItem('user');
      let parseUser = JSON.parse(dataUser);
      let userEmail = parseUser.email;
      this.userSubscription = this.users.usersSubject.subscribe(
        (data: Users[]) => {
          this.usersTab = data;
          console.log(this.usersTab);
          let userIndex = this.usersTab.findIndex(
            (element) => element.email == userEmail
          );
          this.userEnCours = this.usersTab[userIndex];
          console.log(this.userEnCours);
        }
      );
    }
  }

  logout() {
    this.users.logout();
    this.router.navigate(['/accueil']);
  }

  activeClass(number: number) {
    $('#mainMenu li a.active').removeClass('active');
    $('#navItem' + number).addClass('active');
  }
}
