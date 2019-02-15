import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiografiaPage } from './biografia';

@NgModule({
  declarations: [
    BiografiaPage,
  ],
  imports: [
    IonicPageModule.forChild(BiografiaPage),
  ],
})
export class BiografiaPageModule {}
