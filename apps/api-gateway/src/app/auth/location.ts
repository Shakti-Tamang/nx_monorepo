// src/location/location.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure CORS appropriately for your frontend URL
  },
})
export class LocationGateway {
  private readonly logger = new Logger(LocationGateway.name);

  // Handle a client connecting
  afterInit(server: any) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  // Handle incoming location updates from a client
  @SubscribeMessage('updateLocation')
  handleLocationUpdate(@MessageBody() data: { lat: number, lng: number, userId: string }, @ConnectedSocket() client: Socket): void {
    // Process the location data (e.g., save to database, update internal state)
    this.logger.log(`Received location update for user ${data.userId}: ${data.lat}, ${data.lng}`);

    // Broadcast the update to all other connected clients (or specific observers)
    client.broadcast.emit('locationUpdate', data);
  }

  // Handle a client disconnecting
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Handle a client connecting
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
