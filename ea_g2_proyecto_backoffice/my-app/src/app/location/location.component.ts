import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Location } from '../models/location';
import { LocationService } from '../services/location.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @Output() locationsUpdate = new EventEmitter<void>();

  postLocationForm: FormGroup;

  page = 0;
  locations: Location[] = [];
  test?: String;
  previous = "<";
  next = ">";
  first_page = true;
  last_page = false;
  location_length = 0;

  constructor( public locationService: LocationService, private formBuilder: FormBuilder){
    this.postLocationForm = this.formBuilder.group({
      location: ['', [Validators.required]],
      activities: ['', [Validators.required]]
    });
  }

  async postLocation(): Promise<void>{
    if (this.postLocationForm.valid) {
      await this.locationService.postLocation(this.postLocationForm.value).subscribe((res: any) => {
        this.locations.unshift(res.location);
        this.postLocationForm.reset();
        this.locationsUpdate.emit();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario.");
    }
  } 

  ngOnInit(): void {
    this.getLocations(this.page);
    this.locationLength();
  }

  locationLength(): void {
    this.locationService.locationLength().subscribe (length =>{
      this.location_length = length;
      if(this.location_length <= (this.page!*5)+5){
        this.last_page = true
      }
    })
  }

  nextPage(): void {
    this.locationLength();
    this.page!++;
    if(this.location_length <= this.page!*5+5){
      this.last_page = true
    }
    this.first_page = false;
    this.getLocations(this.page);
  }

  previousPage(): void{
    this.locationLength();
    this.page!--;
    if(this.page == 0){
      this.first_page = true;
    }
    if(this.location_length >= this.page!*5+5){
      this.last_page = false;
    }
    this.getLocations(this.page);
  }

  getLocations(page: any): void{
    this.locationService.getLocations(page).subscribe (locations =>{
      console.log(locations);
      this.locations = locations;
    })
  }

  deleteLocation(location: Location): void{
    console.log("Eliminando " + location._id);
    location.active = false;
    this.locationService.deactivateLocation(location).subscribe (res =>{
      console.log(res);
      this.locationsUpdate.emit();
    })
    location.location = "DELETED";
  }
}
