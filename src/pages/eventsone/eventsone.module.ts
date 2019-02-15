import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsonePage } from './eventsone';

@NgModule({
  declarations: [
    EventsonePage,
  ],
  imports: [
    IonicPageModule.forChild(EventsonePage),
  ],
})
export class EventsonePageModule {}
