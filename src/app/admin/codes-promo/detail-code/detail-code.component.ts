import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodesPromo } from 'src/app/modeles/codesPromo';
import { CodesPromoService } from 'src/app/services/codes-promo.service';

@Component({
  selector: 'app-detail-code',
  templateUrl: './detail-code.component.html',
  styleUrls: ['./detail-code.component.css'],
})
export class DetailCodeComponent implements OnInit {
  @Input() code: CodesPromo;
  @Input() codeIndex: number;

  constructor(
    private codesPromoService: CodesPromoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  statutCode(data: boolean) {
    this.code.actif = data;

    this.codesPromoService.updateCodePromo(this.codeIndex, this.code);
  }
  delete() {
    // this.codesPromoService.deleteCodePromoToServer(this.code, this.codeIndex);
  }
}
