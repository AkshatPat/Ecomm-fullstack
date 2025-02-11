import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  errorMsg = '';

  getValue: any;
  postValue: any;

  getMethod() {}

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.regForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]), // Added required validation for lastname
      email: new FormControl('', [Validators.required, Validators.email]), // Added email validation
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit(): void {}

  navLog(event: Event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }

  formObj: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  };

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.regForm.valid) {

      this.formObj = this.regForm.value;
      
            this.auth.register(this.formObj).subscribe({
              next: (res: any) => {console.log(res)
                if (res.result) {
                  this.router.navigate(['login']);
                }
              },
              error: (error) => {
                this.errorMsg = "An unknown error occurred. Please try again.";
              },
              complete: () => {
                console.log('Registration request completed.');
                this.formObj = {
                  firstname: '',
                  lastname: '',
                  email: '',
                  password: '',
                };
              }
            });
      
    } else {
      this.errorMsg = 'Please fill in all required fields correctly.';
    }
  }
}
