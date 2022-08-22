import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export class FirebaseUser implements DecodedIdToken {
  [key: string]: any;
  aud: string;
  auth_time: number;
  email?: string;
  email_verified?: boolean;
  exp: number;
  firebase: {
    [key: string]: any;
    identities: { [key: string]: any };
    sign_in_provider: string;
    sign_in_second_factor?: string;
    second_factor_identifier?: string;
    tenant?: string;
  };
  iat: number;
  iss: string;
  phone_number?: string;
  picture?: string;
  sub: string;
  uid: string;
}
