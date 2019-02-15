import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventsonePage } from '../eventsone/eventsone';
import {Service} from '../../providers/service/service';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: Service) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

  eventsone(event) {
        this.navCtrl.push(EventsonePage,{
          event: event
        });
    }
}
