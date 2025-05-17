import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher]), SharedModule],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
