import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Panier } from 'src/app/modeles/panier';
import { PanierService } from 'src/app/services/panier.service';
import { UsersService } from 'src/app/services/users.service';
import firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false;
  panier: Panier[] = [];
  dataPanier;
  constructor(
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
  }

  logout() {
    this.users.logout();
    this.router.navigate(['/accueil']);
  }
}
