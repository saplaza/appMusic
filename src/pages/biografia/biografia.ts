import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Service} from '../../providers/service/service';

/**
 * Generated class for the BiografiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-biografia',
  templateUrl: 'biografia.html',
})
export class BiografiaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: Service) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiografiaPage');
  }

}
