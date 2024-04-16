import { Activity } from "./activity";

export interface Location {
  _id?: String;
  location: String;
  active: Boolean;
  activities: Activity;
}