import { RBAC } from '@base/decorators/auth.decorator';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { SystemService } from './system.service';
@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly systemService: SystemService) {}

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách banner' })
  @Get('get-banners')
  async getAllBanners() {
    return await this.systemService.getAllBanners();
  }

  @ApiOperation({ summary: 'Lấy danh sách banner đang sử dụng' })
  @Get('get-active-banners')
  async getActiveBanners() {
    return await this.systemService.getActiveBanners();
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy banner theo id' })
  @Get('get-banner/:id')
  async getBannerById(@Param('id') id: string) {
    return await this.systemService.findBannerById(id);
  }

  @ApiOperation({ summary: 'Tạo banner mới' })
  @Post('create-banner')
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    return await this.systemService.createBannerAsync(createBannerDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Cập nhật banner' })
  @Patch('update-banner/:id')
  async updateBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return await this.systemService.updateBannerAsync(id, updateBannerDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xóa banner' })
  @Delete('delete-banner/:id')
  async deleteBanner(@Param('id') id: string) {
    return await this.systemService.deleteBannerAsync(id);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Tắt/bật banner' })
  @Patch('toggle-status/:id')
  async toggleBannerStatus(@Param('id') id: string) {
    return await this.systemService.toggleBannerStatus(id);
  }
}
