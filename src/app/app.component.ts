import { Component, OnInit } from '@angular/core';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { ConfigService } from './services/config.service';
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
  configData: any;
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
              private configService: ConfigService) {
    this.configService.get().subscribe((data: any) => {
        this.configData = data;
        this.weatherService.apiKey = this.configData.weatherApiKey;
        setInterval(() => {
          this.currentDate = new Date();
        }, 1);
        setInterval(() => {
          this.getLocationAndWeather();
        }, 1000 * 60 * 900); // Every 15 minutes
        setInterval(() => {
          this.getCalendarEvents();
        }, 1000 * 60);  // Every minute
        this.loginToOffice365();
        this.getLocationAndWeather();
        this.getCalendarEvents();
    });
  }

  getLocationAndWeather() {
    if (this.configData.currentLatitude != null && this.configData.currentLongitude != null) {
      this.getWeather(this.configData.currentLatitude, this.configData.currentLongitude);
    }
    else {
      this.locationService.getPosition().then(pos =>
      {
        this.getWeather(pos.lat, pos.lng);
        console.log(`Positon: ${pos.lat} ${pos.lng}`);
      },
      err => {
        console.log('Error getting location: ', err)
      });
    }
  }

  getCalendarEvents() {
    this.microsoftGraphService.getCalendarByTimeRange().subscribe((data: any) => {
      const office365CalendarEvents = data.value.reverse();
      for (const event of office365CalendarEvents) {
        let until = '-';
        if (event.start.timeZone === 'UTC') {
          const eventStartDate = new Date(event.start.dateTime + 'Z');
          const partialDaysUntil = moment(new Date(eventStartDate).setHours(0, 0, 0, 0)).diff(moment(new Date(this.currentDate).setHours(0, 0, 0, 0)), 'days');
          const maxMinutesUntil = moment(new Date(eventStartDate)).diff(moment(new Date(this.currentDate)), 'minutes');
          if (partialDaysUntil < 1) {
            until = 'Today at ' + this.datePipe.transform(eventStartDate, 'h:mm aaa');
          }
          else if (partialDaysUntil >= 1 && partialDaysUntil < 2) {
            until = 'Tomorrow at ' + this.datePipe.transform(eventStartDate, 'h:mm aaa');
          }
          else {
            until = 'in ' + partialDaysUntil + ' days';
          }
          if (maxMinutesUntil > 0) {
            this.calendar.push({
              icon: 'fa-briefcase',
              name: event.subject,
              until: until
            });
          }
        }
        else {
          this.calendar.push({
            icon: 'fa-briefcase',
            name: event.subject,
            until: until
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
