import { Auth, RBAC } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { AuthorizedContext } from '@modules/auth/types';
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
import { PointHistoryDto } from './dto/point-history.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateUserDto } from './dto/update-user..dto';
import { UserRoles } from './enums/roles.enum';
import { PointHistoryService } from './point-history.service';
import { UserService } from './user.service';

@ApiTags('Users')
@Auth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly pointHistoryService: PointHistoryService,
  ) {}

  @RBAC(UserRoles.ADMIN)
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

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách người dùng đã xóa' })
  @ApiResponseType(BaseUserDto, { isArray: true })
  @Get('get-deleted-users')
  async getDeletedUsers() {
    return await this.userService.getDeletedUsersAsync();
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponseType(BaseUserDto)
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUserAsync(createUserDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponseType(BaseUserDto)
  @Put('update-user/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserAsync(userId, updateUserDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng' })
  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUserAsync(userId);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Khôi phục người dùng' })
  @Patch('restore-user/:userId')
  async restoreUser(@Param('userId') userId: string) {
    return await this.userService.restoreUserAsync(userId);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Đặt lại mật khẩu người dùng' })
  @Patch('reset-password/:userId')
  async resetPassword(@Param('userId') userId: string) {
    return await this.userService.resetPasswordAsync(userId);
  }

  @Get('my-point-history')
  @ApiOperation({ summary: 'Lấy lịch sử điểm của tôi' })
  @ApiResponseType(PointHistoryDto, { isArray: true })
  async getMyPointHistory(@UserRequest() context: AuthorizedContext) {
    return await this.pointHistoryService.getPointHistoriesByUserIdAsync(
      context.userId,
    );
  }

  @RBAC(UserRoles.ADMIN)
  @Get('point-history/:userId')
  @ApiOperation({ summary: 'Lấy lịch sử điểm của người dùng' })
  @ApiResponseType(PointHistoryDto, { isArray: true })
  async getPointHistoryByUserId(@Param('userId') userId: string) {
    return await this.pointHistoryService.getPointHistoriesByUserIdAsync(
      userId,
    );
  }

  @Get('my-transactions')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch của tôi' })
  @ApiResponseType(TransactionDto, { isArray: true })
  async getMyTransactions(@UserRequest() context: AuthorizedContext) {
    return await this.userService.getTransactionByUserIdAsync(context.userId);
  }

  @RBAC(UserRoles.ADMIN)
  @Get('transactions/:userId')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch của người dùng' })
  @ApiResponseType(TransactionDto, { isArray: true })
  async getTransactionsByUserId(@Param('userId') userId: string) {
    return await this.userService.getTransactionByUserIdAsync(userId);
  }
}
