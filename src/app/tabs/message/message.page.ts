import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map, takeUntil } from 'rxjs/operators';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { IConversation } from 'src/app/interfaces/IConversation';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { MessageProvider } from '../../providers/message/message.provider';

@Component({
  selector: 'app-message',
  templateUrl: 'message.page.html',
  styleUrls: ['message.page.scss']
})

export class MessagePage extends BaseComponent {
  private userId: string;

  public messages: any[];
  public isReciever: boolean;

  constructor(
    private storage: Storage,
    private messageProvider: MessageProvider,
    private router: Router,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public getRefreshedData(event: any) {
    this.getMessages(event);

    event.target.complete();
  }

  public invokeChatMode(response: any) {
    this.navCtrl.setDirection('forward');
    this.router.navigate(['tabs/messages/chat'], {
      state: {
        recieverId: this.userId === response.originalSender._id ? response.originalReciever._id : response.originalSender._id,
        senderId: this.userId,
        carShareId: response.carShareId,
        messages: response.messages,
        recieverUsername: this.getRecipientsUsername(response)
      }
    });
  }

  public getRecipientsUsername(conversation: IConversation) {
    if (this.userId === conversation.originalSender._id) {
      return conversation.originalReciever.username;
    }

    return conversation.originalSender.username;
  }

  private getMessages(event?: any) {
    return this.messageProvider.getMessagesForUser(this.userId).subscribe((response: any) => {
      if (response.originalSenderId === this.userId) {
        this.isReciever = false;
      } else {
        this.isReciever = true;
      }

      this.messages = response;

      if (event) {
        event.target.complete();
      }

      this.performCarryOnConversation();
    });
  }

  private performCarryOnConversation() {
    this.activatedRoute.paramMap
      .pipe(
        map(() => window.history.state),
        takeUntil(this.destroyed)
      ).subscribe(async (data) => {
        if (data.fromFeedPage) {
          if (this.messages.length === 0) {
            this.router.navigate(['tabs/messages/chat'], {
              state: {
                recieverId: data.recieverId,
                senderId: this.userId,
                carShareId: data.carShareId
              }
            });
          } else {
            this.messages.forEach(message => {
              if (message.carShareId === data.carShareId) {
                this.invokeChatMode(message);
              } else {
                this.router.navigate(['tabs/messages/chat'], {
                  state: {
                    recieverId: data.recieverId,
                    senderId: this.userId,
                    carShareId: data.carShareId
                  }
                });
              }
            });
          }
        }
      });
  }

  ionViewWillEnter() {
    document.querySelector('ion-tab-bar').style.display = 'flex';
  }

  async ionViewDidEnter() {
    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.userId = userId;

    this.getMessages();
  }
}
