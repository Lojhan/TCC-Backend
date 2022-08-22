import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class FirebaseService {
  firebaseInstance: firebase.app.App;

  constructor() {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    this.firebaseInstance = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  validateToken(token: string): Promise<DecodedIdToken> {
    return this.firebaseInstance.auth().verifyIdToken(token);
  }
}
