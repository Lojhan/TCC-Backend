import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PredictionsRepository } from 'src/database/repositories/prediction.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [FirebaseModule, HttpModule],
  controllers: [PredictionsController],
  providers: [PredictionsService, PredictionsRepository],
})
export class PredictionsModule {}
