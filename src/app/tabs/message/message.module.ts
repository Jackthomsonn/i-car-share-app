import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ChatPage } from './chat/chat.page';
import { MessagePage } from './message.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: MessagePage
    }, {
      path: 'chat',
      component: ChatPage
    }]),
    ComponentsModule,
    PipesModule
  ],
  providers: [Geolocation],
  declarations: [MessagePage, ChatPage]
})

export class MessagePageModule { }
