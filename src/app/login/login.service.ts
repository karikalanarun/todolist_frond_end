import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}
  hello() {
    console.log('say hello');
  }
}
