// package: 
// file: chat.proto

import * as jspb from "google-protobuf";

export class ChatMessage extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getUser(): string;
  setUser(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessage): ChatMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessage;
  static deserializeBinaryFromReader(message: ChatMessage, reader: jspb.BinaryReader): ChatMessage;
}

export namespace ChatMessage {
  export type AsObject = {
    message: string,
    user: string,
    to: string,
  }
}

export class ReceiveMessagesRequests extends jspb.Message {
  getNumberofmessages(): number;
  setNumberofmessages(value: number): void;

  getMaxageseconds(): number;
  setMaxageseconds(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReceiveMessagesRequests.AsObject;
  static toObject(includeInstance: boolean, msg: ReceiveMessagesRequests): ReceiveMessagesRequests.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReceiveMessagesRequests, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReceiveMessagesRequests;
  static deserializeBinaryFromReader(message: ReceiveMessagesRequests, reader: jspb.BinaryReader): ReceiveMessagesRequests;
}

export namespace ReceiveMessagesRequests {
  export type AsObject = {
    numberofmessages: number,
    maxageseconds: number,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

