import { OTPAuth } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialLoginDto } from './dto/credential-login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { InitialAdminDto } from './dto/init-admin.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthorizedContext, ResponseRegister, ResponseToken } from './types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Khởi tạo dữ liệu quản trị viên',
  })
  @Post('initialize')
  async initializeDataAsync(@Body() initialData: InitialAdminDto) {
    return await this.authService.initializeDataAsync(initialData);
  }

  @ApiResponseType(ResponseRegister)
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
  })
  @Post('register')
  async registerAsync(@Body() registerDto: RegisterDto) {
    return await this.authService.registerAsync(registerDto);
  }

  @ApiResponseType(ResponseToken)
  @ApiOperation({
    summary: 'Đăng nhập bằng tài khoản và mật khẩu',
  })
  @Post('credential-login')
  async credentialLoginAsync(@Body() authDto: CredentialLoginDto) {
    return await this.authService.credentialLoginAsync(authDto);
  }

  @ApiOperation({
    summary: 'Gửi yêu cầu quên mật khẩu',
  })
  @Post('forget-password')
  async forgetPasswordAsync(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPasswordAsync(forgetPasswordDto);
  }

  @ApiOperation({
    summary: 'Xác thực mã OTP',
  })
  @Post('verify-otp')
  async verifyOtpAsync(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtpAsync(verifyOtpDto);
  }

  @OTPAuth()
  @ApiOperation({
    summary: 'Đặt lại mật khẩu',
  })
  @Post('reset-password')
  async resetPasswordAsync(
    @UserRequest() context: AuthorizedContext,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPasswordAsync(
      context.userId,
      resetPasswordDto,
    );
  }
}
