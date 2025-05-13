import { Auth, RBAC } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
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
import { BaseUserDto } from './dto/base-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user..dto';
import { UserRoles } from './enums/roles.enum';
import { UserService } from './user.service';

@ApiTags('Users')
@Auth()
@RBAC(UserRoles.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponseType(BaseUserDto, { isArray: true })
  @Get('get-users')
  async getAllUsers() {
    return await this.userService.getAllUsersAsync();
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiResponseType(BaseUserDto)
  @RBAC(UserRoles.NORMAL_USER)
  @Get('get-user/:userId')
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserByIdAsync(userId);
  }

  @ApiOperation({ summary: 'Lấy danh sách người dùng đã xóa' })
  @ApiResponseType(BaseUserDto, { isArray: true })
  @Get('get-deleted-users')
  async getDeletedUsers() {
    return await this.userService.getDeletedUsersAsync();
  }

  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponseType(BaseUserDto)
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUserAsync(createUserDto);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponseType(BaseUserDto)
  @Put('update-user/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserAsync(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Xóa người dùng' })
  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUserAsync(userId);
  }

  @ApiOperation({ summary: 'Khôi phục người dùng' })
  @Patch('restore-user/:userId')
  async restoreUser(@Param('userId') userId: string) {
    return await this.userService.restoreUserAsync(userId);
  }

  @ApiOperation({ summary: 'Đặt lại mật khẩu người dùng' })
  @Patch('reset-password/:userId')
  async resetPassword(@Param('userId') userId: string) {
    return await this.userService.resetPasswordAsync(userId);
  }
}
