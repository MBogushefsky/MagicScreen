import { Component, OnInit } from '@angular/core';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { MsalService } from '@azure/msal-angular';
import { MicrosoftGraphService } from './services/microsoft-graph.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { CloudService } from './services/cloud.service';

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
              private datePipe: DatePipe,
              private cloudService: CloudService) {
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
      },
      err => {
        console.log('Error getting location: ', err)
      }
    );

    this.loginToOffice365();

    this.microsoftGraphService.getCalendarByTimeRange().subscribe((data: any) => {
      const office365CalendarEvents = data.value.reverse();
      for (const event of office365CalendarEvents) {
        let daysUntil = '-';
        if (event.start.timeZone === 'UTC') {
          const eventStartDate = new Date(event.start.dateTime + 'Z');
          const maxMinutesUntil = moment(eventStartDate.setHours(0, 0, 0, 0)).diff(moment(this.currentDate.setHours(0, 0, 0, 0)), 'minutes');
          if (maxMinutesUntil <= this.minutesInADay) {
            daysUntil = 'Today at ' + this.datePipe.transform(eventStartDate, 'h:mm aaa');
          }
          else if (maxMinutesUntil > this.minutesInADay && maxMinutesUntil < (this.minutesInADay * 2)) {
            daysUntil = 'Tomorrow at ' + this.datePipe.transform(eventStartDate, 'h:mm aaa');
          }
          else {
            daysUntil = 'in ' + Math.round((maxMinutesUntil / this.minutesInADay)) + ' days';
          }
          if (maxMinutesUntil > 0) {
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
