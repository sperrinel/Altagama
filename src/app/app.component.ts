import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as $ from 'jQuery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  titre = 'Altagama';

  constructor() {
    var firebaseConfig = {
      apiKey: 'AIzaSyDgBS61L9tUDYmWpC7-n_Kqgzwp58Ihe4k',
      authDomain: 'altagama-9d227.firebaseapp.com',
      databaseURL:
        'https://altagama-9d227-default-rtdb.europe-west1.firebasedatabase.app/',
      projectId: 'altagama-9d227',
      storageBucket: 'altagama-9d227.appspot.com',
      messagingSenderId: '460364418958',
      appId: '1:460364418958:web:dfefa6cfa9029efbf91edf',
      measurementId: 'G-0K35M0GR3D',
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
}
