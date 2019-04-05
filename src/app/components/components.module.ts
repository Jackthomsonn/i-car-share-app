import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileContentComponent } from './profile-content/profile-content.component';
import { CarShareCounterComponent } from './car-share-counter/car-share-counter.component';
import { SearchComponent } from './search/search.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule
  ],
  declarations: [CarShareCounterComponent, SearchComponent, ProfileContentComponent],
  exports: [CarShareCounterComponent, SearchComponent, ProfileContentComponent]
})
export class ComponentsModule { }
