import {Component, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {AdminService} from "../../services/admin.service";
import {MatTableDataSource} from "@angular/material/table";
import {Device} from "../../model/device";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {DeviceDialogComponent} from "../device-dialog/device-dialog.component";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ChatUiComponent} from "../chat-ui/chat-ui.component";
import {WebSocketAPI} from "../../util/websocketapi";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumnsUsers: string[] = ['username', 'role', 'edit', 'delete', 'manageDevices', 'chat'];
  displayedColumnsDevices: string[] = ['id', 'description', 'address', 'maximumHourlyConsumption', 'edit', 'delete'];
  displayedColumnsUserDevices: string[] = ['id', 'description', 'address', 'maximumHourlyConsumption', 'remove'];
  displayedDevices: string[] = ['id', 'description', 'associate'];
  dataSourceUserDevices!: MatTableDataSource<Device>;
  dataSourceUsers!: MatTableDataSource<User>;
  dataSourceDevices!: MatTableDataSource<Device>
  showUsers: boolean = false;
  showDevices: boolean = false;
  showAllDevices: boolean = false;
  showUserDevices: boolean = false;
  chatWithUser1: boolean = false;
  chatWithUser2: boolean = false;
  expandedRow!: any;
  row!: any;
  searchValue!: string;


  constructor(private adminService: AdminService, private dialog: MatDialog, private userService: UserService,
              private authService: AuthenticationService, private webSocketApi: WebSocketAPI) {
  }

  ngOnInit(): void {
    this.getAllDevices();
    this.getAllUsers();

  }

  openUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val == 'save') {
        this.getAllUsers();
      }
    });
  }

  openDeviceDialog() {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val == 'save') {
        this.getAllDevices();
      }
    });
  }

  editUser(row: any): void {
    this.row = row;
    this.dialog.open(UserDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val == 'update') {
        this.getAllUsers();
      }
    })
  }

  editDevice(row: any): void {
    console.log(row);
    this.dialog.open(DeviceDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val == 'update') {
        this.getAllDevices();
      }
    })
  }

  deleteUser(userId: number) {
    this.adminService.deleteUser(userId).subscribe(
      () => {
        alert("User successfully deleted!");
        this.getAllUsers();
        this.getAllDevices();
      }, () => {
        alert("Error while deleting user!");
      }
    )
  }


  deleteDevice(deviceId: number) {
    this.adminService.deleteDevice(deviceId).subscribe(
      () => {
        alert("Device successfully deleted!")
        this.getAllDevices();
      }, () => {
        alert("Error while deleting device!");
      }
    )
  }

  changeSubject(value: boolean) {
    this.showUsers = value;
    this.showUserDevices = false;
    this.showAllDevices = !value;
  }

  displayDevicesTable() {
    this.showDevices = !this.showDevices;
  }

  getAllUsers() {
    this.searchValue = '';
    this.adminService.getAllUsers().subscribe(data => {
      this.dataSourceUsers = new MatTableDataSource(data);
    })
  }

  getAllDevices() {
    this.searchValue = '';
    this.adminService.getAvailableDevices().subscribe(data => {
      this.dataSourceDevices = new MatTableDataSource<Device>(data);
    })

  }

  displayDevices(row: any) {
    this.expandedRow = row;
    this.showUserDevices = true;
    this.showUsers = false;
    this.displayDevicesTable();
    this.adminService.getUserAssociatedDevices(this.expandedRow.username).subscribe(data => {
      this.dataSourceUserDevices = new MatTableDataSource<Device>(data);
    })
  }

  associateDevice(row: any) {
    this.adminService.associateDevice(this.expandedRow.username, row.id).subscribe(data => {
      this.displayDevices(this.expandedRow);
      this.getAllDevices();
    })
  }

  removeDevice(row: any) {
    this.adminService.removeDevice(this.expandedRow.username, row.id).subscribe(data => {
      this.displayDevices(this.expandedRow);
      this.getAllDevices();
    })
  }

  logout() {
    this.authService.logout();
  }

  search() {
    if (this.showUsers) {
      this.adminService.getUserByUsername(this.searchValue).subscribe(data => {
        console.log(" searched user  " + data)
        this.dataSourceUsers = new MatTableDataSource(Array.of(data));
      }, () => {
        alert("Not found!")
      })
    } else if (this.showAllDevices) {
      this.adminService.getDevicesByDescription(this.searchValue).subscribe(data => {
        this.dataSourceDevices = new MatTableDataSource(data);
      }, () => {
        alert("Not found!")
      });
    }
  }

  chatWithUsers(row: any) {
    if(row.username === 'user1') {
      this.chatWithUser1 = !this.chatWithUser1;
    }
    if(row.username === 'user2') {
      this.chatWithUser2 = !this.chatWithUser2;
    }
  }

}
