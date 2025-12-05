import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies)
    token = req.cookies[process.env.COOKIE_NAME || 'todoAuthKey'];
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: any) {
    // payload.sub is user id
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
