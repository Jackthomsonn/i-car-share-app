import { MetresToMilesPipe } from './metres-to-miles.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicModule } from '@ionic/angular';
import { DurationPipe } from './duration/duration.pipe';
import { PlaceNamePipe } from './place-name/place-name.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  providers: [NativeGeocoder],
  declarations: [DurationPipe, PlaceNamePipe, MetresToMilesPipe],
  exports: [DurationPipe, PlaceNamePipe, MetresToMilesPipe]
})

export class PipesModule { }
