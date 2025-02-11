import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  errorMsg = "";

constructor(private auth: AuthService, private router: Router, private http: HttpClient) { 
  this.userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Added email validation
    password: new FormControl('', [Validators.required]),  // Added required validation for lastname
  });
}

logObj: any = {
  email: '',
  password: '',
};

ngOnInit(): void {}

navReg(event: Event){
  event.preventDefault();
  this.router.navigate(['register']);
}



loginUser:any[] = [];

onSubmit(event: Event) {
  event.preventDefault();
  
  if (this.userForm.valid) {
    const { email, password } = this.userForm.value;
    
    this.logObj = { email, password };
    
    
    this.auth.login(this.logObj).subscribe({
      next: (response: any) => {
        if (response.status === true && response.code === 200) {
          // const storeObj= {
          //   firstName:response.data.firstname, 
          //   lastName:response.data.lastname, 
          //   email: response.data.email
          // }
          

          // localStorage.setItem('user', JSON.stringify(storeObj))
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('firstname', response.data.firstname);
          localStorage.setItem('lastname', response.data.lastname);
          localStorage.setItem('email', response.data.email);

          // Navigate to the dashboard after login
          this.router.navigate(['/home']);
        } else {
          console.error('Login failed:', response.message);
        }
      },
      error: (error) => {
        this.errorMsg = "An unknown error occurred during login.";
        console.error("Login error:", error);
      },
      complete: () => {
        console.log('Login request completed.');
      }
    });

  } else {
    this.errorMsg = "Please fill in all required fields correctly.";
  }
}


}