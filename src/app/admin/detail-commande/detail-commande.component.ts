import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Commandes } from 'src/app/modeles/commandes';
import { CommandesService } from 'src/app/services/commandes.service';

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
  styleUrls: ['./detail-commande.component.css'],
})
export class DetailCommandeComponent implements OnInit {
  // commande: Commandes = {
  //   id: 0,
  //   date: '',
  //   client: '',
  //   commande: '',
  //   prixCommande: '',
  //   livraison: '',
  //   codePromo: '',
  //   dateDeTraitement: '',
  //   traite: '',
  //   commentaire: '',
  // };

  @Input() commande: Commandes;
  detailCommande: Commandes;

  constructor(
    private route: ActivatedRoute,
    private commandesService: CommandesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // const id = this.route.snapshot.params['id'];
    // console.log(id);
    // this.commandesService.getSinglecommande(+id).then((commande: Commandes) => {
    //   this.commande = commande;
    //   console.log(this.commande);
    // });
  }

  // onBack() {
  //   this.router.navigate(['/admin']);
  // }
}
