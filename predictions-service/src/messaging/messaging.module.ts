import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

export const MESSAGING_CONSTANTS = {
  KAFKA_CLIENT_PRODUCER: 'kafka-client-producer',
  KAFKA_CLIENT_CONSUMER: 'kafka-client-consumer',
  FACTORY: 'messaging-factory',
  BROKERS: ['localhost:9093'],
  PROVIDERS: {
    KAFKA: Transport.KAFKA,
  },
  CLIENT: {
    brokers: ['localhost:9093'],
  },
};

export const messagingProviderFactory = {
  provide: MESSAGING_CONSTANTS.FACTORY,
  useFactory: (client: ClientKafka) => ({
    create: (topic: string) => new MessagingService(client, topic),
  }),
  inject: [
    {
      token: MESSAGING_CONSTANTS.KAFKA_CLIENT_PRODUCER,
      optional: false,
    },
  ],
};

export type MessagingFactory = ReturnType<
  typeof messagingProviderFactory.useFactory
>;

@Module({
  providers: [messagingProviderFactory, ClientKafka],
  exports: [messagingProviderFactory],
  controllers: [MessagingController],
  imports: [
    ClientsModule.register([
      {
        name: MESSAGING_CONSTANTS.KAFKA_CLIENT_PRODUCER,
        transport: Transport.KAFKA,
        options: {
          producerOnlyMode: true,
          client: MESSAGING_CONSTANTS.CLIENT,
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
})
export class MessagingModule {}
