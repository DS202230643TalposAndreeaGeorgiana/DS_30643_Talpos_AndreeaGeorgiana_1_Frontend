import {Component, OnInit} from '@angular/core';
import {Device} from "../../model/device";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {ChartConfiguration} from "chart.js";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  dataSource!: MatTableDataSource<Device>;
  dialogData!: any;
  dateObject!: any;
  measures!: number[];
  selectedDevice!: any;
  charts: boolean = false;
  chartReady: boolean = false;
  displayedColumns: string[] = ['description', 'address', 'maximumHourlyConsumption', 'energyConsumption'];
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
    datasets: [
      {data: [], label: 'Hourly Consumption'}
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(private userService: UserService, private dialog: MatDialog, private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getUsersDevices();
    this.getUserData();
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

  logout() {
    this.authService.logout();
  }

}
