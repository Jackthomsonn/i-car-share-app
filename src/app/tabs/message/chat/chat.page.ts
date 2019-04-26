import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map, takeUntil } from 'rxjs/operators';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { IMessage } from 'src/app/interfaces/IMessage';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { MessageProvider } from './../../../providers/message/message.provider';
import { SocketServiceProvider } from './../../../providers/socket/socket.provider';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})

export class ChatPage extends BaseComponent {
  public messages: any[];
  public recieverId: string;
  public carShareId: string;
  public message: string;
  public recieverUsername: string;

  private userId: string;

  @ViewChild('content') private content: IonContent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageProvider: MessageProvider,
    private socketServiceProvider: SocketServiceProvider,
    private storage: Storage
  ) {
    super();
  }

  public determineColor(message: IMessage) {
    return message.sender._id === this.userId ? 'primary' : 'secondary';
  }

  public determineMarginLeft(message: IMessage) {
    return message.sender._id === this.userId ? '50vw' : '10px';
  }

  public determineMarginRight(message: IMessage) {
    return message.sender._id !== this.userId ? '50vw' : '10px';
  }

  public sendMessage() {
    const messageObject = {
      senderId: this.userId,
      recieverId: this.recieverId,
      carShareId: this.carShareId,
      message: this.message
    };

    this.socketServiceProvider.emit('message:send', messageObject);

    this.messageProvider.sendMessage(messageObject).subscribe(() => {
      this.messages.push({
        message: messageObject.message,
        sender: {
          _id: this.userId
        },
        reciever: {
          _id: this.recieverId
        }
      });

      this.scrollToBottom();

      this.message = '';
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 1000);
  }

  ionViewWillEnter() {
    document.querySelector('ion-tab-bar').style.display = 'none';
  }

  async ionViewDidEnter() {
    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.userId = userId;

    this.activatedRoute.paramMap
      .pipe(
        map(() => window.history.state),
        takeUntil(this.destroyed)
      ).subscribe(async (data) => {
        this.messages = data.messages || [];
        this.recieverId = userId === data.senderId ? data.recieverId : data.senderId;
        this.recieverUsername = data.recieverUsername;
        this.carShareId = data.carShareId;

        setTimeout(() => {
          this.content.scrollToBottom(500);
        }, 1000);
      });

    this.socketServiceProvider.on('message:recieved', (data: any) => {
      this.messages.push({
        message: data.message,
        sender: {
          _id: data.senderId
        },
        reciever: {
          _id: data.recieverId
        }
      });

      this.scrollToBottom();
    });
  }

  ionViewDidLeave() {
    this.socketServiceProvider.off(['message:recieved']);
  }
}
