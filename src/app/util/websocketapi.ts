import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import {WebSocketShareService} from "../services/websocketshareservice";
import {environment} from "../../environments/environment";
import {ChatMessage} from "../../../generated/chat_pb";

@Injectable({
  providedIn:'root'
})
export class WebSocketAPI {
  webSocketEndPoint: string = environment.apiUrl + '/ws';
  topic: string = "/topic/message/" + sessionStorage.getItem("authenticatedUser");
  topicSeen: string = "/topic/seen";
  topicTyping: string = "/topic/typing";

  stompClient: any;

  constructor(private websocketShare: WebSocketShareService){}

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame:any) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent:any) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  connect() {
    // build absolute path, websocket doesn't fail during deploying with a context path
    const socket = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const headers = {};
    this.stompClient.connect(headers, () => {
      this.stompClient.subscribe(this.topic, ()=> {
        console.log("aiciii")
    });
  });
}

  connectSeen() {
    console.log("Initialize WebSocket Connection seen");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame:any) {
      _this.stompClient.subscribe(_this.topicSeen, function (sdkEvent:any) {
        _this.onSeenReceived(sdkEvent);
        console.log(sdkEvent)
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);

  }

  connectTyping() {
    console.log("Initialize WebSocket Connection Typing");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame:any) {
      _this.stompClient.subscribe(_this.topicTyping, function (sdkEvent:any) {
        _this.onTypingReceived(sdkEvent);
        console.log(sdkEvent)
        console.log("typing")
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);

  }

  seenMessage(message: ChatMessage) {
    this.stompClient.send("/app/seen",{}, message.getMessage());
  }

  typingMessage(typing: string) {
    this.stompClient.send("/app/typing", {}, typing);
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error:any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      console.log("Error");
      this._connect();
    }, 5000);
  }

  onMessageReceived(message: { body: any; }) {
    console.log("message  " + message)
    this.websocketShare.onNewValueReceive(message.body);
  }

  onSeenReceived(message: { body: any; }) {
    console.log("message  " + message)
    this.websocketShare.onNewValueReceive(message.body);
  }

  onTypingReceived(message: { body: any; }) {
    console.log("message  " + message)
    this.websocketShare.onNewValueReceiveTyping(message.body);
  }
}
