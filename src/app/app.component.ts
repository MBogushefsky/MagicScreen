import { Component } from '@angular/core';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { CurrentWeather } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentDate: Date = new Date();
  currentHoursMins = '00:00';
  currentWeather: CurrentWeather;

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    setInterval(() => {
      this.currentDate = new Date();
      this.currentHoursMins = this.getHoursMinsFromDate(this.currentDate);
    }, 1);
    setInterval(() => {
      console.log('Current Weather ', this.currentWeather);
    }, 1000 * 5);
    this.locationService.getPosition().then(pos =>
    {
      this.getWeather(pos.lat, pos.lng);
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
    });
  }

  getHoursMinsFromDate(date: Date){
    const hours = date.getHours();
    let hoursString = '00'
    const minsString = date.getMinutes();
    if (hours > 9) {
      hoursString = hours.toString();
    }
    else {
      hoursString = '0' + hours.toString();
    }
    return hoursString + ':' + minsString;
  }
  getWeather(lat: number, long: number) {
    this.weatherService.byCoordinates(lat, long).subscribe((data: CurrentWeather) => {
        this.currentWeather = data;
    });
  }

}
