import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '';

  constructor(private http: HttpClient) { }

  currentByCoordinates(lat: number, long: number){
    return this.http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + this.apiKey);
  }

  oneCallWeatherByCoordinates(lat: number, long: number){
    return this.http.get('http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + this.apiKey);
    //return this.http.get('assets/weather.json');
  }

  getIconUrl(icon: string){
    return 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
  }
}
