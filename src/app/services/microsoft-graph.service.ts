import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftGraphService {
  constructor(private http: HttpClient) { }

  getCalendarByTimeRange(){
    return this.http.get('https://graph.microsoft.com/v1.0/me/calendar/events');
  }
}
