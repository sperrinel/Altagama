import { Commandes } from './../../modeles/commandes';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandesService } from 'src/app/services/commandes.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-commandes',
  templateUrl: './gestion-commandes.component.html',
  styleUrls: ['./gestion-commandes.component.css'],
})
export class GestionCommandesComponent implements OnInit {
  // toggleVoirCommande: boolean = false;
  detailCommande: Commandes;
  toggleFiltrer: boolean = false;
  filtreForm;
  commandesFiltrees: Commandes[] = [];
  commandesAffichees: Commandes[] = [];
  copieCommande: Commandes;
  commandes: Commandes[] = [];
  commandesSubscription: Subscription;
  filtreEnCours: boolean = false;
  constructor(
    private commandesService: CommandesService,
    fb: FormBuilder,
    private datepipe: DatePipe
  ) {
    this.filtreForm = fb.group({
      date: [''],
      nomClient: [''],
      traitee: [''],
    });
  }

  ngOnInit(): void {
    this.filtreEnCours = false;
    this.toggleFiltrer = false;
    this.detailCommande = null;
    this.commandesSubscription =
      this.commandesService.commandesSubject.subscribe(
        (commandes: Commandes[]) => {
          this.commandes = commandes;
          if (this.filtreEnCours == true) {
            this.onSubmitFiltrerForm();
          } else {
            this.commandesAffichees = this.commandes.slice();
            this.commandesAffichees.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          }
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

  toggleFiltrerMethod() {
    this.toggleFiltrer = !this.toggleFiltrer;
    if (this.toggleFiltrer == false) {
      this.filtreEnCours == false;
    }
  }

  onSubmitFiltrerForm() {
    const formValue = this.filtreForm.value;
    const date = this.datepipe.transform(formValue['date'], 'dd/MM/yyyy');
    const nomClient = formValue['nomClient'];
    const traitee = formValue['traitee'];

    this.commandesFiltrees = [];

    this.filtrage(nomClient, date, traitee);
  }

  filtrage(nomClient: string, date, traitee) {
    //1) FILTRE PAR COMMANDES TRAITEES OU NON
    if (traitee == 'Oui') {
      for (let i = 0; i < this.commandes.length; i++) {
        if (this.commandes[i].traite == 'Oui') {
          this.commandesFiltrees.push(this.commandes[i]);
        }
      }
    } else if (traitee == 'Non') {
      for (let i = 0; i < this.commandes.length; i++) {
        if (this.commandes[i].traite == 'Non') {
          this.commandesFiltrees.push(this.commandes[i]);
        }
      }
    } else {
      this.commandesFiltrees = this.commandes.slice();
    }

    //2) FILTRE PAR DATE
    let commandesFiltreesParDate: Commandes[] = [];

    if (date !== null) {
      for (let i = 0; i < this.commandesFiltrees.length; i++) {
        if (
          this.datepipe.transform(
            this.commandesFiltrees[i].date,
            'MM/dd/yyyy'
          ) == date
        ) {
          commandesFiltreesParDate.push(this.commandesFiltrees[i]);
        }
        // console.log(
        //   this.datepipe.transform(commandesFiltreesParDate[i].date, 'dd/MM/yyyy')
        // );
      }
    } else {
      commandesFiltreesParDate = this.commandesFiltrees;
    }

    //3) COMMANDES FILTREES PAR NOM
    let commandesFiltreesParNom: Commandes[] = [];

    if (nomClient !== '') {
      for (let i = 0; i < commandesFiltreesParDate.length; i++) {
        if (
          commandesFiltreesParDate[i].client.nom.toLowerCase() ==
          nomClient.toLowerCase()
        ) {
          commandesFiltreesParNom.push(commandesFiltreesParDate[i]);
        }
      }
    } else {
      commandesFiltreesParNom = commandesFiltreesParDate;
    }
    this.commandesAffichees = commandesFiltreesParNom.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.filtreEnCours = true;
    this.toggleFiltrer = false;
  }
}
