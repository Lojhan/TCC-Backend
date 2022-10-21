import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/config';
import { PredictionsModule } from './predictions/predictions.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [PredictionsModule, PrismaModule, MessagingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
