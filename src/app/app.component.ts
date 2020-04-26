import { Component, OnInit } from '@angular/core';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { MsalService } from '@azure/msal-angular';
import { MicrosoftGraphService } from './services/microsoft-graph.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  minutesInADay = 1440;
  currentDate: Date = new Date();
  currentHoursMins = '00:00';
  weather: any;
  calendar: any[] = [];

  constructor(private locationService: LocationService,
              public weatherService: WeatherService,
              private authService: MsalService,
              private microsoftGraphService: MicrosoftGraphService,
              private datePipe: DatePipe) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1);
    setInterval(() => {
      console.log('Current Weather ', this.weather);
    }, 1000 * 5);
    this.locationService.getPosition().then(pos =>
    {
      this.getWeather(pos.lat, pos.lng);
      console.log(`Positon: ${pos.lat} ${pos.lng}`);
    });
    this.loginToOffice365();
    this.microsoftGraphService.getCalendarByTimeRange().subscribe((data: any) => {
      let office365CalendarEvents = data.value.reverse();
      for (const event of office365CalendarEvents) {
        let daysUntil = '-';
        if (event.start.timeZone == 'UTC') {
          const eventStartDate = new Date(event.start.dateTime + 'Z');
          const minutesUntil = moment(eventStartDate).diff(moment(this.currentDate), 'minutes');
          if (minutesUntil <= this.minutesInADay) {
            daysUntil = 'Today';
          }
          else if (minutesUntil > this.minutesInADay && minutesUntil < (this.minutesInADay * 2)) {
            daysUntil = 'Tomorrow at ' + this.datePipe.transform(eventStartDate, 'h:mm aaa');
          }
          else {
            daysUntil = 'in ' + Math.round((minutesUntil / this.minutesInADay)) + ' days';
          }
          if (minutesUntil > 0) {
            this.calendar.push({
              icon: 'fa-briefcase',
              name: event.subject,
              daysUntil: daysUntil
            });
          }
        }
        else {
          this.calendar.push({
            icon: 'fa-briefcase',
            name: event.subject,
            daysUntil: daysUntil
          });
        }
      }
    });
  }

  loginToOffice365() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (isIE) {
      this.authService.loginRedirect({
        extraScopesToConsent: ['user.read', 'openid', 'profile', 'Calendars.Read']
      });
    } else {
      this.authService.loginPopup({
        extraScopesToConsent: ['user.read', 'openid', 'profile', 'Calendars.Read']
      });
    }
  }

  getWeather(lat: number, long: number) {
    this.weatherService.oneCallWeatherByCoordinates(lat, long).subscribe((data: any) => {
        this.weather = data;
    });
  }

}
