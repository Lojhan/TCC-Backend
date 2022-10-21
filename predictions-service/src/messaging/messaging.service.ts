import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable({ scope: Scope.TRANSIENT })
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly client: ClientKafka,
    private readonly topic: string,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  send(message: string) {
    return this.client.emit(this.topic, message).subscribe();
  }
}
