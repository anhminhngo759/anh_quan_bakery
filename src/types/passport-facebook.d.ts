declare module 'passport-facebook' {
  import type { Request } from 'express';
  import type { Strategy as PassportStrategy } from 'passport';
  import type { Profile as PassportProfile } from 'passport';

  interface Profile extends PassportProfile {
    id: string;
    displayName: string;
    name?: {
      familyName?: string;
      givenName?: string;
      middleName?: string;
    };
    gender?: string;
    profileUrl?: string;
    photos?: Array<{ value: string }>;
    emails?: Array<{ value: string }>;
    _json: {
      id: string;
      name: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      picture?: {
        data: {
          url: string;
        };
      };
    };
  }

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    profileFields?: string[];
    enableProof?: boolean;
    authType?: string;
    display?: string;
  }

  interface VerifyCallback {
    (error: Error | null, user?: any, info?: any): void;
  }

  class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyCallback);
    userProfile(accessToken: string, done: (error: Error | null, profile?: Profile) => void): void;
  }

  export = Strategy;
} 