import { Controller, Inject } from '@nestjs/common';
import { messagingProviderFactory } from './messaging.module';
import { MessagingService } from './messaging.service';

@Controller()
export class MessagingController {
  messagingService: MessagingService;

  constructor(
    @Inject('messaging-factory')
    private readonly factory: ReturnType<
      typeof messagingProviderFactory.useFactory
    >,
  ) {
    this.messagingService = this.factory.create('tcc');
  }
}
