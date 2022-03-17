import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produits } from 'src/app/modeles/produits';
import { ProduitsService } from 'src/app/services/produits.service';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.css'],
})
export class AddProduitComponent implements OnInit {
  uniqueID = '';

  produitsSubscription: Subscription;
  produits: Produits[];
  fileIsUploading = false;
  fileUrl: string =
    'https://firebasestorage.googleapis.com/v0/b/altagama-9d227.appspot.com/o/images%2FAltagama-vin-par-defaut.png?alt=media&token=e6cb51b9-13e5-431b-9e89-233fa26ab308';
  fileUploaded = false;

  constructor(
    private produitsService: ProduitsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uniqueID = this.generateUniqueID();
    this.produitsSubscription = this.produitsService.produitsSubject.subscribe(
      (produits: Produits[]) => (this.produits = produits)
    );
    this.produitsService.emitProduitsSubject();
  }

  onSubmit(form: NgForm) {
    const id = this.uniqueID;
    const nom = form.value['nom'].toUpperCase();
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

    const nouveauProduit = new Produits(
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

    this.produitsService.addProduit(nouveauProduit);

    this.router.navigate(['/add']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.produitsService.uploadFile(file).then((url: any) => {
      this.fileUrl = url;
      this.fileIsUploading = false;
      this.fileUploaded = true;
    });
  }

  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

  generateUniqueID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
