import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID?.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
      callbackURL: (
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3001/api/auth/google/callback'
      ).trim(),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // Handle cases where familyName might be undefined
    const fullName = name.familyName
      ? `${name.givenName} ${name.familyName}`
      : name.givenName || profile.displayName || emails[0].value.split('@')[0];

    const user = {
      providerId: id,
      email: emails[0].value,
      name: fullName,
      avatar: photos[0]?.value,
      provider: 'google',
    };
    done(null, user);
  }
}
