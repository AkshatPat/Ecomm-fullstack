import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  login(logObj: any): Observable<any>{
    return this.http.post(this.apiUrl+"login-user", logObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('loggedIn'); //if value exists then return true otherwise false
  }

  register(formObj: any): Observable<any>{
    return this.http.post(this.apiUrl+"create-user", formObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
