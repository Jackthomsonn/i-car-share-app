import { CreatorPage } from './creator/creator.page';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProfilePage } from './profile.page';
import { TrackerPage } from './tracker/tracker.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PlaceNamePipe } from 'src/app/pipes/place-name/place-name.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: ProfilePage
    }, {
      path: 'tracker',
      component: TrackerPage
    }, {
      path: 'creator',
      component: CreatorPage
    }])
  ],
  providers: [Geolocation, PlaceNamePipe],
  declarations: [ProfilePage, TrackerPage, CreatorPage]
})

export class ProfilePageModule { }
