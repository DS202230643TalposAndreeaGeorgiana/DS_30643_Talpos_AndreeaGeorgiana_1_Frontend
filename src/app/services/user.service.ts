import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {Device} from "../model/device";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = sessionStorage.getItem("authenticatedUser");

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  getUserAssociatedDevices(): Observable<Device[]> {
    return this.http.get<Device[]>("http://localhost:8080/users/devices/" + this.user, this.authService.HTTPOptions);
  }

  getUserData(): Observable<User> {
    return this.http.get<User>("http://localhost:8080/users/data/" + this.user, this.authService.HTTPOptions);
  }

  getMeasuresByDay(timestamp: string, id: number): Observable<number[]> {
    timestamp = timestamp.replaceAll('/', '_');
    console.log(timestamp)
    return this.http.get<number[]>("http://localhost:8080/measures/day/" + timestamp + "/" + id, this.authService.HTTPOptions);
  }

  sendNotificationToServer() {
    return this.http.get("http://localhost:8080/app/application/", this.authService.HTTPOptions);
  }

}
