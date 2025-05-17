import { OTPGuard } from '@base/guards/otp.guard';
import { JwtStrategy } from '@base/passports/jwt.strategy';
import { SharedModule } from '@modules/shared/shared.module';
import { SystemModule } from '@modules/system/system.module';
import { User } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthCacheService } from './auth-cache.service';
import { AuthEmailService } from './auth-email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([User]),
    SharedModule,
    SystemModule,
  ],
  controllers: [AuthController, AccountController],
  providers: [
    JwtStrategy,
    OTPGuard,
    AuthService,
    ConfigService,
    AuthCacheService,
    AccountService,
    AuthEmailService,
  ],
})
export class AuthModule {}
