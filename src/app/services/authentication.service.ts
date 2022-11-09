import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../model/user";
import {Observable} from "rxjs";

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

  constructor(private http: HttpClient, private router: Router) {
  }

  token: string = "";

  public login(user: User): boolean {
    this.http.post("http://localhost:8080/authenticate", user, this.HTTPOptionsLogin).subscribe(data => {
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
    return this.http.get<string>("http://localhost:8080/users/role/" + username, this.HTTPOptionsLogin);
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
