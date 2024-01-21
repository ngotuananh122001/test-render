import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3003/user/twitter/callback',
    });
  }

  async validate(token: string, secret: string, profile: Profile) {
    console.log("validate", JSON.stringify(profile));
    if (!token || !secret || !profile) {
      throw new UnauthorizedException();
    }

    return profile;
  }
}
