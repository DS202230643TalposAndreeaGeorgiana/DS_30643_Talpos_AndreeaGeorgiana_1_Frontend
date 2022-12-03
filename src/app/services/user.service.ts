import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {Device} from "../model/device";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = sessionStorage.getItem("authenticatedUser");
  apiUrl!: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.apiUrl = environment.apiUrl;
  }

  getUserAssociatedDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl+"/users/devices/" + this.user, this.authService.HTTPOptions);
  }

  getUserData(): Observable<User> {
    return this.http.get<User>(this.apiUrl+"/users/data/" + this.user, this.authService.HTTPOptions);
  }

  getMeasuresByDay(timestamp: string, id: number): Observable<number[]> {
    timestamp = timestamp.replaceAll('/', '_');
    console.log(timestamp)
    return this.http.get<number[]>(this.apiUrl+"/measures/day/" + timestamp + "/" + id, this.authService.HTTPOptions);
  }

}
