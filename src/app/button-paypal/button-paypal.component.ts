import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from 'src/environments/environment';

import { CommandesService } from '../services/commandes.service';
import { PanierService } from '../services/panier.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-button-paypal',
  templateUrl: './button-paypal.component.html',
  styleUrls: ['./button-paypal.component.css'],
})
export class ButtonPaypalComponent implements OnInit {
  @Input() price;
  @Input() userEnCours;
  @Input() frais;
  payPalConfig: IPayPalConfig;
  currency = `${environment.CURRENCY}`;
  clientId = `${environment.ID_CLIENT_PAYPAL}`;
  constructor(
    private commandesService: CommandesService,
    private usersService: UsersService,
    private panierService: PanierService,
    router: Router
  ) {}

  ngOnInit(): void {
    this.initConfig();
    console.log('userEnCours depuis paypal : ', this.userEnCours);
    console.log('panier depuis paypal : ', this.panierService.panier);
    console.log('price depuis paypal : ', this.price);
  }
  initConfig(): void {
    const price = this.price;
    const currency = this.currency;
    const clientId = this.clientId;

    this.payPalConfig = {
      currency: currency,
      clientId: clientId,
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: price,
                breakdown: {
                  item_total: {
                    currency_code: currency,
                    value: price,
                  },
                },
              },
              items: [
                {
                  name: 'PAIEMENT ALTAGAMA',
                  quantity: '1',
                  category: 'PHYSICAL_GOODS',
                  unit_amount: {
                    currency_code: currency,
                    value: price,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );

        const commande = this.commandesService.creerCommandes(
          this.panierService.panier,
          this.price,
          this.userEnCours,
          this.frais
        );

        this.commandesService.addcommande(commande);

        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
