import 'dotenv/config'
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { AuthService } from './auth.service';
import { TwitterStrategy } from './strategies/twitter.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    TwitterStrategy,
  ],
  controllers: [],
  exports: [AuthService, JwtStrategy, JwtModule]
})
export class AuthModule { }