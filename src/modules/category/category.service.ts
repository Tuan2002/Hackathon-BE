import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BaseCategoryDto } from './dto/base-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private generateSlug(name: string): string {
    // Loại bỏ dấu tiếng Việt và ký tự đặc biệt
    const slug = name
      .toLowerCase()
      .normalize('NFD') // chuyển thành ký tự tổ hợp
      .replace(/[\u0300-\u036f]/g, '') // xóa dấu
      .replace(/[^a-z0-9\s-]/g, '') // xóa ký tự không phải chữ, số, khoảng trắng
      .trim()
      .replace(/\s+/g, '-'); // thay khoảng trắng bằng dấu gạch ngang

    // Random số từ 1 đến 999
    const randomNum = Math.floor(Math.random() * 999) + 1;

    return `${slug}-${randomNum}`;
  }

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
    const slug = this.generateSlug(createCategoryData.name);
    const newCategory = this.categoryRepository.create({
      ...createCategoryData,
      slug,
    });
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
      slug: this.generateSlug(updateData.name),
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
