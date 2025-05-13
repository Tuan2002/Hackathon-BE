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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseConfigDto } from './dto/base-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { PublicConfigDto } from './dto/public-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { SystemService } from './system.service';
@ApiTags('Configs')
@Controller('configs')
export class ConfigController {
  constructor(private readonly systemService: SystemService) {}

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả cấu hình' })
  @ApiResponseType(BaseConfigDto, { isArray: true })
  @Get('get-configs')
  async getAllConfigs() {
    return this.systemService.getAllConfigs();
  }

  @ApiOperation({ summary: 'Lấy cấu hình hiện tại' })
  @ApiResponseType(PublicConfigDto)
  @Get('get-active-config')
  async getActiveConfig() {
    return this.systemService.getActiveConfigAsync();
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Tạo cấu hình' })
  @ApiResponseType(BaseConfigDto)
  @ApiBody({ type: CreateConfigDto })
  @Post('create-config')
  async createConfig(@Body() createConfigDto: CreateConfigDto) {
    console.log(createConfigDto);
    return this.systemService.createConfigAsync(createConfigDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Cập nhật cấu hình' })
  @ApiResponseType(BaseConfigDto)
  @Put('update-config/:id')
  async updateConfig(
    @Param('id') id: string,
    @Body() updateConfigDto: UpdateConfigDto,
  ) {
    return this.systemService.updateConfigAsync(id, updateConfigDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xóa cấu hình' })
  @ApiResponseType(BaseConfigDto)
  @Delete('delete-config/:id')
  async deleteConfig(@Param('id') id: string) {
    return this.systemService.deleteConfigAsync(id);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Kích hoạt cấu hình' })
  @ApiResponseType(BaseConfigDto)
  @Patch('set-active-config/:id')
  async setActiveConfig(@Param('id') id: string) {
    return this.systemService.setActiveConfigAsync(id);
  }
}
