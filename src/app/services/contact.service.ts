import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private api = 'https://formcarry.com/s/xMg7GGNEXOU';
  constructor(private http: HttpClient) {}

  // postMessage(input: any) {
  //   this.http.post(this.api, input).toPromise();
  // }

  postMessage(input: any) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .post(this.api, input)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => console.error(error));
    });
    return promise;
  }
}
