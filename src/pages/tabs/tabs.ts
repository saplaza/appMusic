import { Component, ViewChild } from '@angular/core';
import { Values } from '../../providers/service/values';
import { Nav } from 'ionic-angular';
import { MyAccount } from '../account/my-account/my-account';
import { Categories } from '../categories/categories';
import { Home } from '../home/home';
import { SearchPage } from '../search/search';
import { MusicPage } from '../music/music';
import { EventsPage } from '../events/events';
import { Globals } from "../../app/config";
import { Tabs } from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild("tabs") tabs: Tabs;
  	@ViewChild(Nav) nav: Nav;
   tab1Root: any = Home;
   tab2Root: any = Categories;
   tab3Root: any = SearchPage;
   tab4Root: any = MyAccount;
   tab5Root: any = MusicPage;
   tab6Root: any = EventsPage;
  constructor(public values: Values) {

  }
  ionViewDidEnter() {
    Globals.tabs = this.tabs;
  }
  home(ev: any) {
      if (ev.length() > 1) {
          ev.popToRoot();
      }
  }
  category(ev: any) {
      if (ev.length() > 1) {
          ev.popToRoot();
      }
  }
  account(ev: any) {
      this.values.hideCloseButton = true;
      if (ev.length() > 1) {
          ev.popToRoot();
      }
  }
  music(ev: any) {
      if (ev.length() > 1) {
          ev.popToRoot();
      }
  }
  events(ev: any) {
      if (ev.length() > 1) {
          ev.popToRoot();
      }
  }
}
