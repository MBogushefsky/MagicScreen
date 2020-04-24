import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '0ad089df07b76c7c3cf465ed0219974e';

  constructor(private http: HttpClient) { }

  byCoordinates(lat: number, long: number){
    return this.http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + this.apiKey);
  }
}
