import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { AccountForgotten } from '../../account/forgotten/forgotten';
import { Config } from '../../../providers/service/config';
import { AccountRegister } from '../../account/register/register';


@Component({
    templateUrl: 'checkout-login.html'
})
export class CheckoutLogin {
    loginData: any;
    loadLogin: any;
    status: any;
    error: any;
    public disableSubmit: boolean = false;
    LogIn: any;
    errors: any;
    loginStatus: any;
    showPasswordEnable: boolean = false;
    facebookSpinner: boolean = false;
    googleSpinner: boolean = false;
    gres: any;

    constructor(public nav: NavController, public service: Service, public functions: Functions, public config: Config, public values: Values/*, public fb: Facebook, public googlePlus: GooglePlus*/) {
        this.loginData = [];
        this.LogIn = "LogIn";
    }
    login() {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.LogIn = "Logging In";
            this.service.login(this.loginData)
                .then((results) => this.handleResults(results));
        }
    }

    validateForm() {
        if (this.loginData.username == undefined || this.loginData.username == "") {
            return false
        }
        if (this.loginData.password == undefined || this.loginData.password == "") {
            return false
        }
        else {
            return true
        }
    }
    handleResults(results) {
        this.disableSubmit = false;
        this.LogIn = "LogIn";
        if (!results.errors && results.data) {
            this.functions.showAlert('Success', 'You have successfully logged in');
            this.nav.pop();

        }
        else if (results.errors) {
            this.functions.showAlert('Error', 'invalid username/password');
        }
    }
    forgotten() {
        this.nav.push(AccountForgotten);
    }

    guest(){
        this.values.guest = true;
        this.nav.pop();
    }

    dismiss() {
    this.nav.pop();
    }

    showPassword(){
    this.showPasswordEnable = true; 
    }
    
    hidePassword(){
    this.showPasswordEnable = false; 
    }
 
 /* facebookLogin() {
        this.facebookSpinner = true;
       this.fb.login(['public_profile', 'user_friends', 'email']).then((response) => {
            this.service.sendToken(response.authResponse.accessToken).then((results) => {
                this.facebookSpinner = false;
                this.nav.setRoot(TabsPage);
                
                this.functions.showAlert('success', 'Logged in successfully');
            });
        }).catch((error) => {
            console.log(error)
            this.facebookSpinner = false;
            this.functions.showAlert('Error', error);
        });
    }
    gmailLogin() {
        this.googleSpinner = true;
        this.googlePlus.login({
            'scopes': '',
            'webClientId': this.config.webClientId,
            'offline': true
        }).then((res) => {
             this.gres = res;
             console.log(this.gres);
            this.googleSpinner = false;
            this.values.avatar = res.imageUrl;
            
            this.service.googleLogin(res).then((results) => {
                this.functions.showAlert('success', 'Logged in successfully');
                this.nav.setRoot(TabsPage);
            });
        }).catch((err) => {
            this.googleSpinner = false;
            this.error = err;
            this.functions.showAlert('Error', err);
            console.error(err);
        });
    }*/
    signup(){
        this.nav.push(AccountRegister);
    }
}