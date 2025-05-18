import { SecurityOptions } from '@constants';
import { SystemService } from '@modules/system/system.service';
import { User } from '@modules/user/entities/user.entity';
import { PointNote } from '@modules/user/enums/point-note.enum';
import { UserRoles } from '@modules/user/enums/roles.enum';
import { UserService } from '@modules/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { generateOTP } from 'otp-agent';
import { Repository } from 'typeorm';
import { AuthCacheService } from './auth-cache.service';
import { AuthEmailService } from './auth-email.service';
import { CredentialLoginDto } from './dto/credential-login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { InitialAdminDto } from './dto/init-admin.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResponseRegister, ResponseToken } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authCacheService: AuthCacheService,
    private authEmailService: AuthEmailService,
    private systemService: SystemService,
    private userService: UserService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async initializeDataAsync(initialData: InitialAdminDto) {
    const { userName, email, password, firstName, lastName } = initialData;

    const existAdminUser = await this.usersRepository.findOne({
      where: [
        { userName: userName, role: UserRoles.ADMIN },
        { email: email, role: UserRoles.ADMIN },
      ],
    });

    if (existAdminUser) {
      throw new BadRequestException({
        message:
          'Tài khoản quản trị đã được khởi tạo, vui lòng truy cập trang quản trị',
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );

    const newUser = this.usersRepository.create({
      userName,
      email,
      hashedPassword: hashedPassword,
      firstName,
      lastName,
      role: UserRoles.ADMIN,
    });
    await this.usersRepository.save(newUser);
    return {
      isSuccess: true,
      message: 'Khởi tạo tài khoản quản trị thành công',
    };
  }

  async credentialLoginAsync(credentialDto: CredentialLoginDto) {
    const { email, password } = credentialDto;
    const activeConfig = await this.systemService.getFullActiveConfigAsync();

    const storedUser = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        userName: true,
        hashedPassword: true,
        avatar: true,
        loginFailedTimes: true,
        role: true,
        isFirstLogin: true,
      },
    });

    if (!storedUser) {
      throw new BadRequestException({
        message: 'Thông tin đăng nhập không chính xác',
      });
    }

    if (storedUser.isLocked) {
      throw new BadRequestException({
        message: 'Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên',
      });
    }

    if (
      storedUser.loginFailedTimes >=
      (activeConfig?.config?.maxLoginAttempts ??
        SecurityOptions.ATTEMPT_FAILURE_LIMIT)
    ) {
      const lockoutTo = await this.authCacheService.getTemporaryLockout(
        storedUser.id,
      );
      if (lockoutTo) {
        return {
          lockoutTo: lockoutTo,
        };
      }
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      storedUser.hashedPassword,
    );

    if (!isPasswordValid) {
      storedUser.loginFailedTimes += 1;
      await this.usersRepository.save(storedUser);

      if (
        storedUser.loginFailedTimes >= SecurityOptions.ATTEMPT_FAILURE_LIMIT
      ) {
        const lockoutTo = dayjs().add(
          SecurityOptions.LOCKOUT_DURATION,
          'minute',
        );
        await this.authCacheService.setTemporaryLockout(
          storedUser.id,
          lockoutTo.toDate(),
        );
        return {
          isSuccess: false,
          message: `Bạn đã nhập sai mật khẩu quá nhiều lần, vui lòng thử lại sau`,
          data: {
            lockoutTo: lockoutTo,
          },
        };
      }
      throw new BadRequestException({
        message: 'Thông tin đăng nhập không chính xác',
      });
    }
    const accessToken = await this.buildToken(storedUser);
    return plainToInstance(
      ResponseToken,
      {
        ...accessToken,
        ...storedUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async registerAsync(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    const existUser = await this.usersRepository.findOne({
      where: [{ email }, { userName: email }],
    });
    if (existUser) {
      throw new BadRequestException({
        message: 'Email hoặc tên đăng nhập đã tồn tại',
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );

    const newUser = this.usersRepository.create({
      userName: email,
      email,
      hashedPassword: hashedPassword,
      firstName,
      lastName,
      role: UserRoles.NORMAL_USER,
    });

    await this.usersRepository.save(newUser);
    await this.userService.addPointAsync(
      newUser.id,
      1000,
      PointNote.REGISTER_REWARD,
    );

    return plainToInstance(
      ResponseRegister,
      {
        ...newUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async forgetPasswordAsync(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;
    const existUser = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        userName: true,
      },
    });
    if (!existUser) {
      throw new BadRequestException({
        message: 'Tài khoản không tồn tại trong hệ thống',
      });
    }

    const otp = generateOTP();
    Promise.all([
      this.authCacheService.setOtpSession(existUser.id, otp),
      this.authEmailService.sendResetPasswordEmail(existUser.email, {
        name: existUser.userName,
        otp: otp,
      }),
    ]);

    return {
      userId: existUser.id,
    };
  }

  async verifyOtpAsync(verifyOtpDto: VerifyOtpDto) {
    const validatedUser = await this.usersRepository.findOne({
      where: { id: verifyOtpDto.userId },
      select: {
        id: true,
        email: true,
        userName: true,
        avatar: true,
      },
    });
    if (!validatedUser) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }

    const cachedOtp = await this.authCacheService.getOtpSession(
      verifyOtpDto.userId,
    );

    if (!cachedOtp) {
      throw new BadRequestException({
        message: 'Mã OTP đã hết hạn hoặc không hợp lệ',
      });
    }

    if (cachedOtp != verifyOtpDto.otp) {
      throw new BadRequestException({
        message: 'Mã OTP không chính xác',
      });
    }

    await this.authCacheService.revokeOtpSession(verifyOtpDto.userId);
    const otpToken = await this.buildOtpToken(validatedUser);
    return {
      otpToken: otpToken,
    };
  }

  async resetPasswordAsync(userId: string, resetPasswordDto: ResetPasswordDto) {
    const { newPassword } = resetPasswordDto;
    const existUser = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        hashedPassword: true,
      },
    });
    if (!existUser) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );

    existUser.hashedPassword = hashedPassword;
    await this.usersRepository.save(existUser);
    const accessToken = await this.buildToken(existUser);

    return plainToInstance(
      ResponseToken,
      {
        ...accessToken,
        ...existUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private async buildToken(userInfo: User) {
    const accessToken = await this.jwtService.signAsync(
      {
        userId: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
        avatar: userInfo?.avatar,
        role: userInfo.role,
      },
      {
        expiresIn: SecurityOptions.JWT_EXPIRATION_TIME,
      },
    );
    return { accessToken };
  }

  private async buildOtpToken(userInfo: User) {
    const otpToken = await this.jwtService.signAsync(
      {
        userId: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
        avatar: userInfo?.avatar,
      },
      {
        expiresIn: SecurityOptions.OTP_EXPIRATION_TIME,
        secret: process.env.JWT_OTP_SECRET,
      },
    );
    return otpToken;
  }
}
