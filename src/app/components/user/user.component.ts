import {Component, Injectable, OnInit} from '@angular/core';
import {Device} from "../../model/device";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {ChartConfiguration} from "chart.js";
import {AuthenticationService} from "../../services/authentication.service";
import {WebSocketShareService} from "../../services/websocketshareservice";
import {WebSocketAPI} from "../../util/websocketapi";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChatMessage} from "../../services/chat.service";
import {ChatService} from "../../services/chat.service";
import {ChatUiComponent} from "../chat-ui/chat-ui.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  dataSource!: MatTableDataSource<Device>;
  socket!:WebSocket;
  dialogData!: any;
  dateObject!: any;
  measures!: number[];
  selectedDevice!: any;
  charts: boolean = false;
  chartReady: boolean = false;
  displayedColumns: string[] = ['description', 'address', 'maximumHourlyConsumption', 'energyConsumption'];
  public barChartLegend = true;
  public barChartPlugins = [];
  messages: ChatMessage[] = [];
  chatWithAdm: boolean = false;


  wsData: string = 'Hello';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
    datasets: [
      {data: [], label: 'Hourly Consumption'}
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(private userService: UserService, private dialog: MatDialog, private authService: AuthenticationService,
              private websocketService: WebSocketShareService, private webSocketAPI: WebSocketAPI, private _snackBar: MatSnackBar, private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.getUsersDevices();
    this.getUserData();
    this.webSocketAPI._connect();
    // this.webSocketAPI.connectTyping();

    // this.onNewValueReceive();
    // this.chatService.receiveMessages().subscribe((m: ChatMessage) => {
    //   // this.zone.run(() => {
    //   // });
    //   console.log('Received chat message via stream', m.toObject());
    //   // this.messages = this.messages.concat(m);
    //   this.messages = [m, ...this.messages];
    //   // this.cdRef.detectChanges();
    // });
  }

  getUsersDevices() {
    this.userService.getUserAssociatedDevices().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    })
  }

  getUserData() {
    this.userService.getUserData().subscribe(data => {
      this.dialogData = data;
    })
  }

  manageAccount(): void {
    this.dialog.open(UserDialogComponent, {
      width: '30%',
      data: this.dialogData
    }).afterClosed().subscribe(val => {
      if (val == 'update') {
        this.getUserData();
      }
    })
  }

  chatWithAdmin() {
    this.chatWithAdm = !this.chatWithAdm;
    // this.webSocketAPI.connectSeen();
    // this.dialog.open(ChatUiComponent, {
    //   width: '30%',
    // });
  }

  sendMessage(messageString: string, user: string) {
    // console.log('message: {}, user {}', messageString, user);
    const message = new ChatMessage();
    message.setMessage(messageString);
    message.setUser(user);
    this.chatService.sendMessage(message);
  }
  showCharts(row: any) {
    this.selectedDevice = row;
    this.charts = !this.charts;
    this.chartReady = false;
  }

  getDate(dateObject: any) {
    this.dateObject = dateObject;
    console.log(dateObject.value)
    const stringified = JSON.stringify(dateObject.value);
    const dob = stringified.substring(1, 11);
  }

  getMeasuresByDay(dateObject: any) {
    this.chartReady = false;
    console.log(dateObject.toLocaleDateString())
    console.log(typeof (dateObject));
    this.userService.getMeasuresByDay(dateObject.toLocaleDateString().toString(), this.selectedDevice.id).subscribe(data => {
      this.measures = data;
      console.log("dataaa " + data)
      this.barChartData.datasets[0].data = data;
      this.chartReady = true;
    })
  }

  connect() {
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }
  // method to receive the updated data.
  // onNewValueReceive() {
  //   this.websocketService.getNewValue().subscribe(resp => {
  //     this.wsData = resp;
  //     if(resp === "Exceeded!!") {
  //       this._snackBar.open(sessionStorage.getItem("authenticatedUser") + ", the maximum hourly consumption is exceeded!!", "",{
  //         panelClass: ['snackBarRed']
  //       });
  //     } else {
  //       this._snackBar.open("New data added for your device: " + resp, "", {
  //         panelClass:['snackBarGreen']
  //       });
  //     }
  //     console.log("response" + resp);
  //   });
  // }

  logout() {
    this.authService.logout();
  }


}
