import { Injectable } from '@angular/core';
import * as grpc from '@grpc/grpc-js';
import { loadPackageDefinition } from '@grpc/proto-loader';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private client: grpc.Client;
  private messagesSubject = new Subject<Message>();
  private sendMessageSubject = new Subject<void>();

  constructor() {
    const packageDefinition = loadPackageDefinition(require('../proto/demo.json'));
    const packageName = Object.keys(packageDefinition)[0];
    const serviceName = Object.keys(packageDefinition[packageName])[0];
    const service = packageDefinition[packageName][serviceName];
    this.client = new grpc.Client(`localhost:50051`, grpc.credentials.createInsecure());
  }

  getMessages(): Observable<Message> {
    this.client.makeUnaryRequest(
      service.getMessages,
      {},
      (error, response) => {
        if (error) {
          console.error(error);
        } else {
          this.messagesSubject.next(response);
        }
      }
    );
    return this.messagesSubject.asObservable();
  }

  sendMessage(message: string): Observable<void> {
    this.client.makeUnaryRequest(
      service.sendMessage,
      { message },
      (error, response) => {
        if (error) {
          console.error(error);
        } else {
          this.sendMessageSubject.next();
        }
      }
    );
    return this.sendMessageSubject.asObservable();
  }

}
