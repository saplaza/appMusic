import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventsonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventsone',
  templateUrl: 'eventsone.html',
})
export class EventsonePage {
  public event;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.event = navParams.get("event");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsonePage');
  }

}
