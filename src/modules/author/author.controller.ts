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
import { BaseAuthorDto } from './dto/base-author.dto';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiOperation({ summary: 'Lấy danh sách tác giả' })
  @ApiResponseType(BaseAuthorDto, { isArray: true })
  @Get('get-authors')
  async getAllAuthors() {
    return await this.authorService.getAllAuthorsAsync();
  }

  @ApiOperation({ summary: 'Lấy thông tin tác giả' })
  @ApiResponseType(BaseAuthorDto)
  @RBAC(UserRoles.ADMIN)
  @Get('get-author/:authorId')
  async getAuthorById(@Param('authorId') authorId: string) {
    return await this.authorService.getAuthorByIdAsync(authorId);
  }

  @ApiOperation({ summary: 'Lấy danh sách tác giả đã xóa' })
  @ApiResponseType(BaseAuthorDto, { isArray: true })
  @Get('get-deleted-authors')
  async getDeletedAuthors() {
    return await this.authorService.getDeletedAuthorsAsync();
  }

  @ApiOperation({ summary: 'Tạo tác giả mới' })
  @ApiResponseType(BaseAuthorDto)
  @Post('create-author')
  async createAuthor(@Body() createAuthorData: CreateAuthorDto) {
    return await this.authorService.createAuthor(createAuthorData);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin tác giả' })
  @ApiResponseType(BaseAuthorDto)
  @Put('update-author/:authorId')
  async updateAuthor(
    @Param('authorId') authorId: string,
    @Body() updateAuthorData: UpdateAuthorDto,
  ) {
    return await this.authorService.updateAuthorAsync(
      authorId,
      updateAuthorData,
    );
  }

  @ApiOperation({ summary: 'Xóa tác giả' })
  @Delete('delete-author/:authorId')
  async deleteAuthor(@Param('authorId') authorId: string) {
    return await this.authorService.deleteAuthorAsync(authorId);
  }

  @ApiOperation({ summary: 'Khôi phục tác giả' })
  @Patch('restore-author/:authorId')
  async restoreAuthor(@Param('authorId') authorId: string) {
    return await this.authorService.restoreAuthorAsync(authorId);
  }
}
