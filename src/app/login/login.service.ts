import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

type LoginDetails = {
  email: string;
  password: string;
};

type SignUpDetails = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  status: 'sucess';
  result: string;
};

const storeAuthToken = tap((data: LoginResponse) => {
  console.log('data ::: ', data);
  localStorage.setItem('auth_token', data.result);
});

type LoginFunction<T> = (req: T) => Observable<LoginResponse>;

const login: <T>(http: HttpClient, url: string) => LoginFunction<T> = (
  http,
  url
) => (req) => {
  return http.post<LoginResponse>(url, req).pipe(storeAuthToken);
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginURL = `${environment.backend_url}/user/login`;
  private signupURL = `${environment.backend_url}/user`;

  constructor(private http: HttpClient) {}

  login = login<LoginDetails>(this.http, this.loginURL);

  signup = login<SignUpDetails>(this.http, this.signupURL);
}
