import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CodesPromo } from 'src/app/modeles/codesPromo';
import { CodesPromoService } from 'src/app/services/codes-promo.service';

@Component({
  selector: 'app-codes-promo',
  templateUrl: './codes-promo.component.html',
  styleUrls: ['./codes-promo.component.css'],
})
export class CodesPromoComponent implements OnInit {
  codesPromo: CodesPromo[] = [];
  codesPromoSub: Subscription;
  toggleAjouterCodePromo: boolean = false;
  commentaire: boolean = false;
  codePromoForm;
  detailCode: CodesPromo;
  indexCode: number;

  constructor(
    private codesPromoService: CodesPromoService,
    fb: FormBuilder,
    private datepipe: DatePipe
  ) {
    this.codePromoForm = fb.group({
      nom: ['', Validators.required],
      dateDeLancement: ['', Validators.required],
      dateDeFin: ['', Validators.required],
      typeRemise: ['', Validators.required],
      montantRemise: [0],
      codePromo: ['', Validators.required],
      commentaire: [''],
    });
  }

  ngOnInit(): void {
    this.indexCode = null;
    this.detailCode = null;
    this.commentaire = false;
    this.toggleAjouterCodePromo = false;
    this.codesPromoSub = this.codesPromoService.codesPromoSubject.subscribe(
      (codes: CodesPromo[]) => {
        this.codesPromo = codes;
      },
      (error: any) => {
        console.log('Erreur : ' + error);
      },
      () => {
        console.log('Observable complété');
      }
    );
  }

  toggleAjouterCodePromoMethod() {
    this.toggleAjouterCodePromo = !this.toggleAjouterCodePromo;
  }

  toggleCommentaireFalse() {
    this.commentaire = false;
  }

  onSubmitCodePromoForm() {
    const formValue = this.codePromoForm.value;
    console.log(formValue);

    const id = this.generateUniqueID();
    const nom = formValue['nom'];
    const actif = false;
    const code = formValue['codePromo'];
    const typeDeRemise = formValue['typeRemise'];
    const montant = formValue['montantRemise'];
    const dateDeLancement = this.datepipe.transform(
      formValue['dateDeLancement'],
      'dd/MM/yyyy'
    );
    const dateDeFin = this.datepipe.transform(
      formValue['dateDeFin'],
      'dd/MM/yyyy'
    );
    const commentaire = formValue['commentaire'];

    let nouveauCodePromo: CodesPromo = new CodesPromo(
      id,
      nom,
      actif,
      code,
      typeDeRemise,
      montant,
      dateDeLancement,
      dateDeFin,
      commentaire
    );

    this.codesPromoService.addCodePromo(nouveauCodePromo);
    this.toggleAjouterCodePromoMethod();
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

  toggleCommentaire() {
    this.commentaire = true;
  }

  voirCode(codeId, index) {
    this.indexCode = index;

    let codeTab = this.codesPromo;
    let CodeIndex = codeTab.findIndex((element) => element.id === codeId);

    let codeTrouve = codeTab[CodeIndex];

    if (codeTrouve && codeTrouve != this.detailCode) {
      this.detailCode = codeTrouve;
      // this.toggleVoirCommande = true;
    } else {
      this.detailCode = null;
      this.indexCode = null;
    }
  }
}
