import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../../../generated/chat_pb";
import {WebSocketAPI} from "../../util/websocketapi";
import {WebSocketShareService} from "../../services/websocketshareservice";


@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUiComponent implements OnInit, OnDestroy {

  @Output()
  messagesToReceiver = new EventEmitter<{messages: ChatMessage[]}>();
  messages: ChatMessage[] = [];
  message!: string;
  doneReceiving: boolean = false;
  read: boolean = false;
  typing: boolean = false;
  typingTimeout:any;
  @Input()
  chatWithAdmin: boolean =false;
  @Input()
  chatWithUser1: boolean = false;
  @Input()
  chatWithUser2: boolean = false;

  @Input()
  receiver!: string;
  currentUser = sessionStorage.getItem('authenticatedUser');
  constructor(private chatService: ChatService, private changeDetector: ChangeDetectorRef, private websocketService: WebSocketShareService, private webSocketApi: WebSocketAPI) { }



  ngOnInit() {
    this.webSocketApi.connectSeen();
    this.getSentMessages();
    this.getReceivedMessages();
  }

  ngOnDestroy(): void {
    this.webSocketApi._disconnect();
  }
  onGetMessages() {
    this.messagesToReceiver.emit({messages: this.messages});
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
    this.doneReceiving = false;

    this.chatService.receiveMessages().subscribe((m: ChatMessage) => {
        console.log('Received chat message via stream', m.toObject());
        if (m.getTo() === sessionStorage.getItem('authenticatedUser') && m.getUser() === this.receiver) {
          if (m.getMessage() === "1") {
            // @ts-ignore
            document.getElementById("typing").innerHTML = m.getTo() + " is typing..."
          } else if (m.getMessage() === "0") {// @ts-ignore
            document.getElementById("typing").innerHTML = ""
          } else {
            this.messages.push(m);
            this.read = false;
            if (m.getUser() != sessionStorage.getItem('authenticatedUser')) {
              this.webSocketApi.seenMessage(this.messages[this.messages.length - 1]);
            }
            this.onSeen();
          }
        }
      }
      ,() =>{console.log("had an error")}, () => {
    });
  }

  onSeen() {
    this.read = false;
    this.websocketService.getNewValue().subscribe(resp => {
      console.log("response" + resp);
      if(this.messages.length > 0 && resp.toString() === this.messages[this.messages.length - 1].getMessage() ) {
        console.log("seeeeen");
        if(this.messages[this.messages.length - 1].getUser() === sessionStorage.getItem('authenticatedUser')) {
          if((this.messages[this.messages.length - 1].getUser() === 'user1' || this.messages[this.messages.length - 1].getUser() === 'user1')  && this.chatWithAdmin) {
            this.read = true;
          } else if(this.messages[this.messages.length - 1].getUser() === 'admin' && this.messages[this.messages.length - 1].getTo() === 'user1' && this.chatWithUser1) {
            this.read = true;
          }else if(this.messages[this.messages.length - 1].getUser() === 'admin' && this.messages[this.messages.length - 1].getTo() === 'user2' && this.chatWithUser2) {
            this.read = true;
          } else {
            this.read = false;
          }
        }
      }
    });
  }

  onTyping() {
    if (this.typingTimeout != undefined)
      clearTimeout(this.typingTimeout);

    const msgToSend = new ChatMessage();
    msgToSend.setMessage("1");
    msgToSend.setUser(sessionStorage.getItem('authenticatedUser')!)
    if(msgToSend.getUser() != 'admin') {
      msgToSend.setTo("admin");
    }
    else {
      msgToSend.setTo(this.receiver);
    }
    this.chatService.sendMessage(msgToSend);

    this.typingTimeout= setTimeout(() => {
        const message1 = new ChatMessage();
        message1.setMessage("0");
        message1.setUser(sessionStorage.getItem('authenticatedUser')!)
        if(message1.getUser() != 'admin') {
          message1.setTo("admin");
        }
        else {
          message1.setTo(this.receiver);
        }
        this.chatService.sendMessage(message1);
      }
      , 500);
  }
}
