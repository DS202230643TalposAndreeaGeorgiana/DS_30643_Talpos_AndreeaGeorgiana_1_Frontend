import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../../../generated/chat_pb";


@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUiComponent implements OnInit {

  @Input()
  messages: ChatMessage[] = [];
  message!: string;
  // sentMessages: ChatMessage[] = [];

  @Input()
  receiver!: string;
  currentUser = sessionStorage.getItem('authenticatedUser');
  constructor(private chatService: ChatService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.getReceivedMessages();
    this.getSentMessages();
  }

  sendMessage() {
    if (this.message) {
      const msgToSend = new ChatMessage();
      msgToSend.setMessage(this.message);
      msgToSend.setUser(sessionStorage.getItem('authenticatedUser')!)
      if(msgToSend.getUser() != 'admin') {
        msgToSend.setTo("admin");
        this.receiver = 'admin'
      }
      else {
        msgToSend.setTo(this.receiver);
      }

      this.messages.push(msgToSend);
      this.chatService.sendMessage(msgToSend);
      this.message = "";
    }
  }

  getSentMessages(): ChatMessage[] {
    return this.messages;
  }

  getReceivedMessages(): ChatMessage[] {
    this.receivedMessages();

    return this.messages;
  }

  receivedMessages() {
    this.chatService.receiveMessages().subscribe((m: ChatMessage) => {
      // this.zone.run(() => {
      // });
      console.log('Received chat message via stream', m.toObject());

      if(m.getTo() === sessionStorage.getItem('authenticatedUser') && m.getUser() === this.receiver) {
        this.messages = this.messages.concat(m);
      }

      // this.messages.reverse();
      // console.log(this.messages);
      // const map = new Map();
      // for (const item of this.messages) {
      //   map.set(item, item);
      // }
      // this.messages =  Array.from(map.values());
      // // this.messages = [m, ...this.messages];
      // this.changeDetector.detectChanges();
    });
  }

  ping(): void {
    const message = new ChatMessage();
    message.setMessage('From NG app');
    message.setUser('NG Hero');
    this.chatService
      .ping(message)
      .then((response: ChatMessage) => {
        console.log('Got ping respnse', response.toObject());
      })
      .catch((reason: any) => {
        console.log('Ping rejected', reason);
      });
  }
}
