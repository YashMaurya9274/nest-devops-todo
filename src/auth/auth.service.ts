import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already in use');
    const user = await this.usersService.create(email, password, name);
    return { id: user._id, email: user.email, name: user.name };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await this.usersService.validatePassword(pass, user.password);
    if (!valid) return null;
    return { id: user._id, email: user.email, name: user.name };
  }

  async loginPayload(user: {
    id: string | Types.ObjectId;
    email: string;
    name: string;
  }) {
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
