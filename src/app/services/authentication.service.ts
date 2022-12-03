import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  HTTPOptionsLogin = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `${sessionStorage.getItem('authToken')}`,
      'Access-Control-Allow-Origin': '*',
    }),
    responseType: 'text' as 'json',
  }

  HTTPOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `${sessionStorage.getItem('authToken')}`,
      'Access-Control-Allow-Origin': '*',
    })
  }

  currentUser!: User;
  apiUrl!: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  token: string = "";

  public login(user: User): boolean {
    this.http.post(this.apiUrl + "/authenticate", user, this.HTTPOptionsLogin).subscribe(data => {
      this.token = data.toString();
      sessionStorage.setItem('authToken', this.token);
      this.currentUser = user;
      sessionStorage.setItem("authenticatedUser", this.currentUser.username);
      this.getUserRole(this.currentUser.username).subscribe(data => {
        sessionStorage.setItem("userRole", data);
        if (data == "ROLE_ADMIN") {
          this.router.navigate(["admin"]);
        } else {
          this.router.navigate(["client"]);
        }
      })
      return true;
    }, error => {
      this.router.navigate(['']);
      return false;
    });
    return false;
  }

  public getUserRole(username: String): Observable<string> {
    return this.http.get<string>(this.apiUrl + "/users/role/" + username, this.HTTPOptionsLogin);
  }

  isLoggedIn() {
    let user = sessionStorage.getItem('authenticatedUser')
    return !(user === null);
  }

  logout() {
    sessionStorage.removeItem('authenticatedUser');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('authToken');
    this.router.navigate(['']);
  }
}
