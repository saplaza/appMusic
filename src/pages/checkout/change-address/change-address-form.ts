import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckoutService } from '../../../providers/service/checkout-service';
import { Values } from '../../../providers/service/values';


@Component({
    templateUrl: 'change-address-form.html'
})
export class ChangeAddressForm {
    
    form: any;
    states: any;
    country: any;
    tabBarElement: any;

    constructor(public nav: NavController, public service: CheckoutService, params: NavParams, public values: Values) {
      this.form = params.data;
      this.values.form = params.data;
      this.form.shipping = false;
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.states = this.form.state[this.form.billing_country]; 
    }
    getRegion(countryId) {
        this.states = this.form.state[countryId];
    }
    changeRegion(countryId) {
        this.form.billing_state = "";
        this.states = this.form.state[countryId];
    }
    saveAddress(){
      //this.values.form = this.form;  
      //this.service.saveAddress(this.form)
      this.nav.pop();
    }
    dismiss(){
      this.nav.pop();
    }

}