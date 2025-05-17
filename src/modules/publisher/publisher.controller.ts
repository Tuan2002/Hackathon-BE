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
import { PublisherService } from './publisher.service';
import { BasePublisherDto } from './dto/base-publisher.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@ApiTags('Publishers')
// @Auth()
// @RBAC(UserRoles.ADMIN)
@Controller('publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @ApiOperation({ summary: 'Lấy danh sách nhà xuất bản' })
  @ApiResponseType(BasePublisherDto, { isArray: true })
  @Get('get-publishers')
  async getAllPublishers() {
    return await this.publisherService.getAllPublishersAsync();
  }

  @ApiOperation({ summary: 'Lấy thông tin nhà xuất bản' })
  @ApiResponseType(BasePublisherDto)
  @RBAC(UserRoles.ADMIN)
  @Get('get-publisher/:publisherId')
  async getPublisherById(@Param('publisherId') publisherId: string) {
    return await this.publisherService.getPublisherByIdAsync(publisherId);
  }

  @ApiOperation({ summary: 'Lấy danh sách nhà xuất bản đã xóa' })
  @ApiResponseType(BasePublisherDto, { isArray: true })
  @Get('get-deleted-publishers')
  async getDeletedPublishers() {
    return await this.publisherService.getDeletedPublishersAsync();
  }

  @ApiOperation({ summary: 'Tạo nhà xuất bản mới' })
  @ApiResponseType(BasePublisherDto)
  @Post('create-publisher')
  async createPublisher(@Body() createPublisherData: CreatePublisherDto) {
    return await this.publisherService.createPublisher(createPublisherData);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin nhà xuất bản' })
  @ApiResponseType(BasePublisherDto)
  @Put('update-publisher/:publisherId')
  async updatePublisher(
    @Param('publisherId') publisherId: string,
    @Body() updatePublisherData: UpdatePublisherDto,
  ) {
    return await this.publisherService.updatePublisherAsync(
      publisherId,
      updatePublisherData,
    );
  }

  @ApiOperation({ summary: 'Xóa nhà xuất bản' })
  @Delete('delete-publisher/:publisherId')
  async deletePublisher(@Param('publisherId') publisherId: string) {
    return await this.publisherService.deletePublisherAsync(publisherId);
  }

  @ApiOperation({ summary: 'Khôi phục nhà xuất bản' })
  @Patch('restore-publisher/:publisherId')
  async restorePublisher(@Param('publisherId') publisherId: string) {
    return await this.publisherService.restorePublisherAsync(publisherId);
  }
}
