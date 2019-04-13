import { PlaceNamePipe } from './../../pipes/place-name/place-name.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './../../components/components.module';
import { CreatorPage } from './creator.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: CreatorPage }])
  ],
  providers: [PlaceNamePipe],
  declarations: [CreatorPage]
})

export class CreatorPageModule { }
