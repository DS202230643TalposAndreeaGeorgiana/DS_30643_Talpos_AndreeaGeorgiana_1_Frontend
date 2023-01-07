import { Injectable } from '@angular/core';
import {ChatServiceClient, Status} from "../../../generated/chat_pb_service";
import {Observable, Subscriber} from "rxjs";
declare function require(path: string) : any;

import {grpc} from "@improbable-eng/grpc-web";
import * as chat_pb from "../../../generated/chat_pb";
import {ChatMessage, ReceiveMessagesRequests} from "../../../generated/chat_pb";
// import {ChatServiceClient, UnaryResponse} from "../../../generated/chat_pb_service";
// import {ChatMessage, Empty} from "../../../generated/chat_pb";
// import {Observable} from "rxjs";
export { ChatMessage, ReceiveMessagesRequests };
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  client: ChatServiceClient;


  constructor() {
    this.client = new ChatServiceClient('http://localhost:8080');
  }

  receiveMessages(): Observable<ChatMessage> {
    return new Observable(obs => {
      this.initStream(obs);
    });
  }

  private initStream(obs: Subscriber<ChatMessage>): void {
    // console.log('ApiService.receiveMessages');
    const req = new ReceiveMessagesRequests();
    const stream = this.client.receiveMessages(req);

    stream.on('status', (status: Status) => {
      // console.log('ApiService.getStream.status', status);
    });
    stream.on('data', (message: ChatMessage) => {
      // console.log('ApiService.getStream.data', message.toObject());
      obs.next(message);
    });
    stream.on('end', () => {
      // console.log('ApiService.getStream.end');
      // obs.complete();
      this.initStream(obs);
    });
  }

  sendMessage(request: ChatMessage): Promise<ChatMessage> {
    console.log("am ajuns aici")
    return new Promise((resolve, reject) => {
      // console.log('ApiService.sendMessage', request);

      this.client.sendMessage(request, (err, response: any) => {
        // console.log('ApiService.sendMessage.response', response);
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  ping(request: ChatMessage): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      console.log('ApiService.get', request);

      this.client.ping(request,
        (error, responseMessage: ChatMessage | null) => {
          console.log('ApiService.get.response', responseMessage);
          if (error) {
            return reject(error);
          }
          resolve(responseMessage!);
        });
    });
  }
}
