import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PredictionsRepository } from 'src/database/repositories/prediction.repository';
import { HttpModule } from '@nestjs/axios';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [FirebaseModule, HttpModule, MessagingModule],
  controllers: [PredictionsController],
  providers: [PredictionsService, PredictionsRepository],
})
export class PredictionsModule {}
