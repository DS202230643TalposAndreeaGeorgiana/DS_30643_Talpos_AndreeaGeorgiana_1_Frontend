import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {AdminService} from "../../services/admin.service";
import {Role} from "../../util/role";

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  userForm!: FormGroup;
  userToEdit!: User;
  currentUser!: User;
  actionBtn: string = "Save";

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private httpClient: HttpClient,
              private adminService: AdminService,
              public dialogRef: MatDialogRef<UserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData: any) {
  }


  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: new FormControl('', {validators: [Validators.required]}),
      password: new FormControl('', {validators: [Validators.required]}),
    });
    if (this.editData) {
      this.actionBtn = "Update";
      this.userForm.controls['username'].setValue(this.editData.username);
      this.userForm.controls['password'].setValue(this.editData.password);
    }
  }

  add() {
    if (!this.editData) {
      if (this.userForm.valid) {
        this.currentUser = new User();
        this.currentUser.username = this.userForm.get('username')?.value;
        this.currentUser.password = this.userForm.get('password')?.value;
        this.currentUser.role = Role.ROLE_CLIENT;
        this.adminService.createUser(this.currentUser).subscribe({
          next: (res) => {
            alert("User added successfully!");
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error while adding the user!");
          }
        });
      }
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.userToEdit = new User();
    this.userToEdit.username = this.userForm.value.username;
    this.userToEdit.password = this.userForm.value.password;
    this.userToEdit.role = Role.ROLE_CLIENT;

    this.adminService.updateUser(this.userToEdit, this.editData.username).subscribe({
      next: (res) => {
        alert("User updated successfully!");
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert("Error while updating the user!");
        alert("An user with this username already exists!")
      }
    });
  }

}
