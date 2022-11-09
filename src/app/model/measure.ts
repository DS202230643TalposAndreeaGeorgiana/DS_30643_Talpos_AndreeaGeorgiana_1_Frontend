import {Timestamp} from "rxjs";

export class Measure {
  id!: number;
  energyConsumption!: number;
  timestamp!: Timestamp<any>;
}
