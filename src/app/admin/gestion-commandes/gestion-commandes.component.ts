import { Commandes } from './../../modeles/commandes';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandesService } from 'src/app/services/commandes.service';

@Component({
  selector: 'app-gestion-commandes',
  templateUrl: './gestion-commandes.component.html',
  styleUrls: ['./gestion-commandes.component.css'],
})
export class GestionCommandesComponent implements OnInit {
  commandes: Commandes[] = [];
  commandesSubscription: Subscription;
  constructor(private commandesService: CommandesService) {}

  ngOnInit(): void {
    this.commandesSubscription =
      this.commandesService.commandesSubject.subscribe(
        (commandes: Commandes[]) => {
          this.commandes = commandes;
          console.log(this.commandes);
        },
        (error: any) => {
          console.log('Erreur : ' + error);
        },
        () => {
          console.log('Observable complété');
        }
      );
    this.commandesService.emitCommandesSubject();
  }
}
