import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http:HttpClient) { }

  postLocation(newLocation: Location){
    return this.http.post<void>('http://127.0.0.1:3000/location', newLocation);
  }

  getLocations(page: number) {
    return this.http.get<Location[]>('http://127.0.0.1:3000/pagedlocation/' + page);
  }

  getLocation(locationID: String) {
    return this.http.get<Comment>('http://127.0.0.1:3000/location/' + locationID);
  }

  locationLength() {
    return this.http.get<number>('http://127.0.0.1:3000/locationlength');
  }

  deleteLocation(locationID: String) {
    return this.http.delete<void>('http://127.0.0.1:3000/location/' + locationID);
  }

  updateLocation(editLocation : Location) {
    return this.http.put('http://127.0.0.1:3000/location/'+ editLocation._id, editLocation);
  }

  deactivateLocation(editLocation : Location) {
    return this.http.get('http://127.0.0.1:3000/deactivatelocation/'+ editLocation._id);
  }
}
