import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // Logic for handling and broadcasting messages
    this.server.emit('message', data);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('typing', data);
  }
}
