import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerController } from './banner.controller';
import { ConfigController } from './config.controller';
import { Banner } from './entities/banner.entity';
import { Config } from './entities/config.entity';
import { SystemService } from './system.service';

@Module({
  imports: [TypeOrmModule.forFeature([Config, Banner]), SharedModule],
  controllers: [ConfigController, BannerController],
  providers: [SystemService],
})
export class SystemModule {}
