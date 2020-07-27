import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    // country_code: new FormControl('', [Validators.required]),
    // mobile_number: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern(/^[0-9]+$/),
    // ]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  submit() {
    this.loginService.signup(this.signupForm.value).subscribe((_: never) => {
      this.router.navigate(['']);
    });
  }
}
