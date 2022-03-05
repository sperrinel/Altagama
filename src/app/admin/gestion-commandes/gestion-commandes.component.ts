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
  // toggleVoirCommande: boolean = false;
  detailCommande: Commandes;
  copieCommande: Commandes;
  commandes: Commandes[] = [];
  commandesSubscription: Subscription;
  constructor(private commandesService: CommandesService) {}

  ngOnInit(): void {
    this.detailCommande = null;
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

  voirCommande(commandeId) {
    let commandTab = this.commandes;
    let CommandIndex = commandTab.findIndex(
      (element) => element.id === commandeId
    );

    let commandeTrouvee = commandTab[CommandIndex];

    if (commandeTrouvee && commandeTrouvee != this.detailCommande) {
      this.detailCommande = commandeTrouvee;
      // this.toggleVoirCommande = true;
    } else {
      this.detailCommande = null;
      console.log('Une erreur est survenue.');
    }
  }

  traiterCommande(commandeId) {
    let commandTab = this.commandes;
    let CommandIndex = commandTab.findIndex(
      (element) => element.id === commandeId
    );

    this.copieCommande = commandTab[CommandIndex];
    if (this.copieCommande.traite == 'Oui') {
      this.copieCommande.traite = 'Non';
      this.copieCommande.dateDeTraitement = '';
    } else {
      this.copieCommande.traite = 'Oui';
      this.copieCommande.dateDeTraitement = new Date().toLocaleString();
    }
    this.commandesService.commandes[CommandIndex] = this.copieCommande;
    this.commandesService.saveCommandesToServer();
    this.commandesService.emitCommandesSubject();
  }
}
