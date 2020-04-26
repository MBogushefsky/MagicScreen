import { Injectable } from '@angular/core';
//import * as iCloud from 'apple-icloud'
const iCloud = require('apple-icloud');

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor() {
    var username = "mbogushefsky@gmail.com";
    var password = "xdHE7MKmEVREeovrzffdahMu";
    var myCloud = new iCloud("src/assets/icloud-session.json", username, password);
    /*myCloud.saveSession("assets/session.json");
    // This creates a new session with your credentials. This is very slow if you do it every time and also not recommended because apple bans your account if you login too often in a small time area
    myCloud.login("mb", "p", function(err) {
      if (err) {
        // An error occured
      }
      // You logged in successfully!
    });*/
   }
}
