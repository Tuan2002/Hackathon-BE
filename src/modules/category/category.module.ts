import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
