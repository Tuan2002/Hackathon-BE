import { RBAC } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BaseCategoryDto } from './dto/base-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
// @Auth()
// @RBAC(UserRoles.ADMIN)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  @ApiResponseType(BaseCategoryDto, { isArray: true })
  @Get('get-categories')
  async getAllCategories() {
    return await this.categoryService.getAllCategoriesAsync();
  }

  @ApiOperation({ summary: 'Lấy thông tin danh mục' })
  @ApiResponseType(BaseCategoryDto)
  @RBAC(UserRoles.ADMIN)
  @Get('get-category/:categoryId')
  async getCategoryById(@Param('categoryId') categoryId: string) {
    return await this.categoryService.getCategoryByIdAsync(categoryId);
  }

  @ApiOperation({ summary: 'Lấy danh sách danh mục đã xóa' })
  @ApiResponseType(BaseCategoryDto, { isArray: true })
  @Get('get-deleted-categories')
  async getDeletedCategorys() {
    return await this.categoryService.getDeletedCategoriesAsync();
  }

  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiResponseType(BaseCategoryDto)
  @Post('create-category')
  async createCategory(@Body() createCategoryData: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryData);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  @ApiResponseType(BaseCategoryDto)
  @Put('update-category/:categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryData: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategoryAsync(
      categoryId,
      updateCategoryData,
    );
  }

  @ApiOperation({ summary: 'Xóa danh mục' })
  @Delete('delete-category/:categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string) {
    return await this.categoryService.deleteCategoryAsync(categoryId);
  }

  @ApiOperation({ summary: 'Khôi phục danh mục' })
  @Patch('restore-category/:categoryId')
  async restoreCategory(@Param('categoryId') categoryId: string) {
    return await this.categoryService.restoreCategoryAsync(categoryId);
  }
}
