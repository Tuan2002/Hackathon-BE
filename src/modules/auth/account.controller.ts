import { Auth } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { AuthorizedContext, ResponseCurrentUser } from './types';

@ApiTags('Account')
@Auth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiResponseType(ResponseCurrentUser)
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @Get('me')
  async getCurrentUser(@UserRequest() context: AuthorizedContext) {
    return await this.accountService.getCurrentUserAsync(context.userId);
  }

  @ApiResponseType(ResponseCurrentUser)
  @Put('update-profile')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  async updateProfile(
    @UserRequest() context: AuthorizedContext,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    return await this.accountService.updateProfileAsync(
      context.userId,
      updateInfoDto,
    );
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  async changePassword(
    @UserRequest() context: AuthorizedContext,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.accountService.changePasswordAsync(
      context.userId,
      changePasswordDto,
    );
  }
}
