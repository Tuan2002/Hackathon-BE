import { SharedModule } from '@modules/shared/shared.module';
import { SystemModule } from '@modules/system/system.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule, SystemModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
