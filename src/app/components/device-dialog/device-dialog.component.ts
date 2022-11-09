import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Device} from "../../model/device";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.css']
})
export class DeviceDialogComponent implements OnInit {

  deviceForm!: FormGroup;
  deviceToEdit!: Device;
  currentDevice!: Device;
  actionBtn: string = "Save";

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private httpClient: HttpClient,
              private adminService: AdminService,
              public dialogRef: MatDialogRef<DeviceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData: any) {
  }

  ngOnInit(): void {
    console.log(this.editData);
    this.deviceForm = this.formBuilder.group({
      id: new FormControl('',),
      description: new FormControl('', {validators: [Validators.required]}),
      address: new FormControl('', {validators: [Validators.required]}),
      maximumHourlyConsumption: new FormControl('', {validators: [Validators.required]}),

    });
    if (this.editData) {
      this.actionBtn = "Update";
      this.deviceForm.controls['id'].setValue(this.editData.id);
      this.deviceForm.controls['description'].setValue(this.editData.description);
      this.deviceForm.controls['address'].setValue(this.editData.address);
      this.deviceForm.controls['maximumHourlyConsumption'].setValue(this.editData.maximumHourlyConsumption);
    }
  }

  add() {
    console.log(this.deviceForm.value);
    if (!this.editData) {
      if (this.deviceForm.valid) {
        this.currentDevice = new Device();
        this.currentDevice.id = this.deviceForm.get('id')?.value;
        this.currentDevice.description = this.deviceForm.get('description')?.value;
        this.currentDevice.address = this.deviceForm.get('address')?.value;
        this.currentDevice.maximumHourlyConsumption = this.deviceForm.get('maximumHourlyConsumption')?.value;

        this.adminService.createDevice(this.currentDevice).subscribe({
          next: (res) => {
            alert("Device added successfully!");
            this.deviceForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error while adding the device!");
          }
        });
      }
    } else {
      this.updateDevice();
    }
  }

  updateDevice() {
    this.deviceToEdit = new Device();
    this.deviceToEdit.id = this.deviceForm.value.id;
    this.deviceToEdit.address = this.deviceForm.value.address;
    this.deviceToEdit.description = this.deviceForm.value.description;
    this.deviceToEdit.maximumHourlyConsumption = this.deviceForm.value.maximumHourlyConsumption;

    this.adminService.updateDevice(this.deviceToEdit, this.editData.id).subscribe({
      next: (res) => {
        alert("Device updated successfully!");
        this.deviceForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert("Error while updating the device!");
      }
    });
  }
}
