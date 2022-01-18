import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css'],
})
export class MessageModalComponent implements OnInit {
  premierPassage: boolean = true;
  constructor() {}

  ngOnInit(): void {
    this.premierPassage == true;
  }

  onClose() {
    this.premierPassage == false;
  }
}
