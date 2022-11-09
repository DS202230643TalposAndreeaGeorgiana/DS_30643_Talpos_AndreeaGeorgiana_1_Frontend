import {Role} from "src/app/util/role";
import {Device} from "./device";

export class User {
   id!:number;
   username!: string;
   password!: string;
   role!: Role;
   associatedDevices!: Device[];
}
