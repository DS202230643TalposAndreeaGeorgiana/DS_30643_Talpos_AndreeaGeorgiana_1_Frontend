import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {AuthenticationService} from "./authentication.service";
import {Device} from "../model/device";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl!: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.apiUrl = environment.apiUrl;
  }

  getAllUsers(): Observable<User[]> {
    console.log(sessionStorage.getItem("authenticatedUser"))
    return this.http.get<User[]>(this.apiUrl + "/users", this.authService.HTTPOptions);
    // return this.authService.getAllUsers();
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/users/data/" + username, this.authService.HTTPOptions)
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl+ "/users", user, this.authService.HTTPOptions);
  }

  createDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.apiUrl + "/admin/devices", device, this.authService.HTTPOptions);
  }

  updateUser(user: User, username: string): Observable<User> {
    return this.http.put<User>(this.apiUrl + "/users/" + username, user, this.authService.HTTPOptions);
  }

  updateDevice(device: Device, id: number): Observable<Device> {
    return this.http.put<Device>(this.apiUrl + "/admin/devices/" + id, device, this.authService.HTTPOptions);
  }

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl + "/admin/devices", this.authService.HTTPOptions);
  }

  getAvailableDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl + "/admin/devices/available", this.authService.HTTPOptions);
  }

  getDevicesByDescription(description: string): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl = "/admin/devices/available/" + description, this.authService.HTTPOptions);
  }

  deleteUser(userId: number): Observable<number> {
    return this.http.delete<number>(this.apiUrl + "/users/" + userId, this.authService.HTTPOptions);
  }

  deleteDevice(deviceId: number): Observable<number> {
    return this.http.delete<number>(this.apiUrl + "/admin/devices/" + deviceId, this.authService.HTTPOptions);
  }

  associateDevice(username: string, deviceId: number): Observable<Device> {
    return this.http.post<Device>(this.apiUrl + "/users/devices/" + username + "/" + deviceId, this.authService.HTTPOptions);
  }

  removeDevice(username: string, deviceId: number): Observable<number> {
    return this.http.post<number>(this.apiUrl + "/users/devices/remove/" + username + "/" + deviceId, this.authService.HTTPOptions);

  }

  getUserAssociatedDevices(username: string): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl + "/users/devices/" + username, this.authService.HTTPOptions);
  }
}
