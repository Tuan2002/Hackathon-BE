import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), SharedModule],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
