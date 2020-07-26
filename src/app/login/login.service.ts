import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

type LoginDetails = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: 'sucess';
  result: string;
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginURL = `${environment.mockapi_url}/login`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginDetails) {
    return this.http.post<LoginResponse>(this.loginURL, credentials).pipe(
      tap((data: LoginResponse) => {
        localStorage.setItem('auth_token', data.result);
      })
    );
  }
  
}
