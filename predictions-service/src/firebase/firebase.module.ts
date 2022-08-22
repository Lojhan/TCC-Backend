import { Module } from '@nestjs/common';
import { FirebaseTokenGuard } from 'src/guards/firebase-token.guard';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService, FirebaseTokenGuard],
  exports: [FirebaseService, FirebaseTokenGuard],
})
export class FirebaseModule {}
