import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Produits } from 'src/app/modeles/produits';
import { PanierService } from 'src/app/services/panier.service';
import { ProduitsService } from 'src/app/services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit {
  @Input() produits: Produits[] = [];
  produit: Produits;
  copieProduit: Produits;
  fileIsUploading = false;
  fileUrl: string = '';
  copieFileUrl: String = '';
  fileUploaded = false;
  idProduit: number;
  // produits = [
  //   {
  //     id: 5,
  //     nom: 'Vin test',
  //     description: 'description test',
  //     prix: 12.5,
  //   },
  // ];
  @Output() idProduitEdit: EventEmitter<any> = new EventEmitter();
  prodSub: Subscription;
  //------------------------------------------------------------------------------ POUR PAGINATION 1/3
  // pageEnCours = 0;
  // pages = [0, 1, 2, 3];
  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ajouterAuPanier(produit: Produits): void {
    this.panierService.ajouterProduitAuPanier(produit);
  }

  supprimerProduitPanier(produit) {
    this.panierService.supprimerProduitPanier(produit);
  }

  //------------------------------------------------------------------------------ POUR PAGINATION 3/3

  // changerDePage(numPage: number): void {
  //   const prod = this.produitsService.afficherProduitParPage(numPage);
  //   if (prod) {
  //     this.produits = prod;
  //     this.pageEnCours = numPage;
  //   }
  // }

  // pageSuivante(): void {
  //   const nouvellePageEnCours = this.pageEnCours + 1;
  //   const prod =
  //     this.produitsService.afficherProduitParPage(nouvellePageEnCours);
  //   if (prod) {
  //     this.produits = prod;
  //     this.pageEnCours = nouvellePageEnCours;
  //   }
  // }

  // pagePrecedente(): void {
  //   const nouvellePageEnCours = this.pageEnCours - 1;
  //   const prod =
  //     this.produitsService.afficherProduitParPage(nouvellePageEnCours);
  //   if (prod) {
  //     this.produits = prod;
  //     this.pageEnCours = nouvellePageEnCours;
  //   }
  // }

  //Récupère l'id du produit grâce au btn activation de la modal de l'HTML et le donne à la modal via un eventEmitter
  editProduct(index) {
    this.produitsService.getSingleProduit(index).then((produit: Produits) => {
      this.produit = produit;
      this.copieProduit = produit;
      this.fileUrl = this.produit.image;
      this.copieFileUrl = this.produit.image;
      this.idProduit = index;
      console.log(produit);
    });
  }

  sendIdProduit(index) {
    this.idProduit = index;
    console.log('IdPorduit = ' + index);

    // this.router.navigate(['/deleteProduit']);
  }

  //supprime un produit
  onDeleteProduitToServer() {
    this.produitsService
      .getSingleProduit(this.idProduit)
      .then((produit: Produits) => {
        this.produit = produit;
        console.log("quel produit j'ai récupéré :", this.produit);

        this.produitsService.deleteProduitToServer(
          this.produit,
          this.idProduit
        );
      });
  }

  onSubmit(form: NgForm) {
    const id = this.produit.id;
    const nom = form.value['nom'];
    const categorie = form.value['categorie'];
    const description = form.value['description'];
    const image = this.fileUrl;
    const prix = form.value['prix'];
    const prixCarton = form.value['prixCarton'];
    const bodega = form.value['bodega'];
    const alcool = form.value['alcool'];
    const service = form.value['service'];
    const stock = form.value['stock'];
    const cepage = form.value['cepage'];
    const vignification = form.value['vignification'];
    const vieillissement = form.value['vieillissement'];
    const accompagnement = form.value['accompagnement'];

    const produit = new Produits(
      id,
      nom,
      categorie,
      description,
      image,
      prix,
      prixCarton,
      bodega,
      alcool,
      service,
      stock,
      cepage,
      vignification,
      vieillissement,
      accompagnement
    );

    this.produitsService.updateProduit(this.idProduit, produit);
  }

  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.produitsService.uploadFile(file).then((url: any) => {
      this.fileUrl = url;

      this.fileIsUploading = false;
      this.fileUploaded = true;
    });
  }
}
