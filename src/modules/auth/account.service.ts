import { SecurityOptions } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { ResponseCurrentUser } from './types';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getCurrentUserAsync(userId: string) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }

    return plainToInstance(
      ResponseCurrentUser,
      {
        ...userInfo,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateProfileAsync(userId: string, updateData: UpdateInfoDto) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }

    const updatedUser = await this.usersRepository.save({
      ...userInfo,
      ...updateData,
    });

    return plainToInstance(
      ResponseCurrentUser,
      {
        ...updatedUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async changePasswordAsync(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const { oldPassword, newPassword } = changePasswordDto;
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userInfo.hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException({
        message: 'Mật khẩu hiện tại không chính xác',
      });
    }

    const newHashedPassword = await bcrypt.hash(
      newPassword,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );

    await this.usersRepository.update(userId, {
      hashedPassword: newHashedPassword,
    });

    return {
      isSuccess: true,
      message: 'Cập nhật mật khẩu thành công',
    };
  }
}
