import {Measure} from "./measure";

export class Device {
  id!: number;
  description!:string;
  address!:string;
  maximumHourlyConsumption!:any;
  measures!: Measure[];
}
