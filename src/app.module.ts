import { ConfigAppModule } from '@base/modules/configs/config-app.module';
import { DatabaseModule } from '@base/modules/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SharedModule } from '@modules/shared/shared.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigAppModule,
    DatabaseModule,
    PassportModule,
    AuthModule,
    UserModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
