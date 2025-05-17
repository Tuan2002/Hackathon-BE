import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { BaseCategoryDto } from './dto/base-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategoriesAsync() {
    const rawCategories = await this.categoryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    const categoryList = rawCategories.map((item) => {
      return plainToInstance(BaseCategoryDto, item, {
        excludeExtraneousValues: true,
      });
    });
    return categoryList;
  }

  async getDeletedCategoriesAsync() {
    const rawCategories = await this.categoryRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(null),
      },
      order: {
        deletedAt: 'DESC',
      },
    });
    const categoryList = rawCategories.map((category) => {
      return plainToInstance(BaseCategoryDto, category, {
        excludeExtraneousValues: true,
      });
    });
    return categoryList;
  }

  async createCategory(createCategoryData: CreateCategoryDto) {
    const existedCategory = await this.categoryRepository.exists({
      where: {
        name: createCategoryData.name,
      },
    });
    if (existedCategory) {
      throw new BadRequestException({
        message: 'Tên danh mục đã tồn tại',
      });
    }
    const newCategory = this.categoryRepository.create(createCategoryData);
    const createdCategory = await this.categoryRepository.save(newCategory);
    return plainToInstance(BaseCategoryDto, createdCategory, {
      excludeExtraneousValues: true,
    });
  }

  async updateCategoryAsync(categoryId: string, updateData: UpdateCategoryDto) {
    const isCategoryExist = await this.categoryRepository.exists({
      where: {
        name: updateData.name,
        id: Not(categoryId),
      },
    });
    if (isCategoryExist) {
      throw new BadRequestException({
        message: 'Tên danh mục đã tồn tại',
      });
    }
    const categoryInfo = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!categoryInfo) {
      throw new BadRequestException({
        message: 'Danh mục không tồn tại',
      });
    }
    const updatedCategory = await this.categoryRepository.save({
      ...categoryInfo,
      ...updateData,
    });
    return plainToInstance(BaseCategoryDto, updatedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async deleteCategoryAsync(categoryId: string) {
    const categoryInfo = await this.categoryRepository.findOne({
      where: { id: categoryId },
      select: {
        id: true,
      },
    });
    if (!categoryInfo) {
      throw new BadRequestException({
        message: 'Danh mục không tồn tại',
      });
    }
    await this.categoryRepository.softRemove(categoryInfo);
    return {
      categoryId: categoryInfo.id,
    };
  }

  async restoreCategoryAsync(categoryId: string) {
    const categoryInfo = await this.categoryRepository.findOne({
      where: { id: categoryId },
      withDeleted: true,
    });
    if (!categoryInfo) {
      throw new BadRequestException({
        message: 'Danh mục không tồn tại hoặc đã được khôi phục',
      });
    }

    await this.categoryRepository.restore(categoryId);
    return {
      categoryId: categoryInfo.id,
    };
  }

  async getCategoryByIdAsync(categoryId: string) {
    const categoryInfo = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!categoryInfo) {
      throw new BadRequestException({
        message: 'Danh mục không tồn tại',
      });
    }
    return plainToInstance(BaseCategoryDto, categoryInfo, {
      excludeExtraneousValues: true,
    });
  }
}
