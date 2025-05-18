import { SharedModule } from '@modules/shared/shared.module';
import { SystemModule } from '@modules/system/system.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointHistory } from './entities/point-history.entity';
import { Transaction } from './entities/transaction.entity';
import { User } from './entities/user.entity';
import { PointHistoryService } from './point-history.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PointHistory, Transaction]),
    SharedModule,
    SystemModule,
  ],
  controllers: [UserController],
  providers: [UserService, PointHistoryService],
  exports: [UserService, PointHistoryService],
})
export class UserModule {}
