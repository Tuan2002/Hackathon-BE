import { SecurityOptions } from '@constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { BaseUserDto } from './dto/base-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user..dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsersAsync() {
    const [rawUsers, count] = await this.usersRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
    });
    const userList = rawUsers.map((user) => {
      return plainToInstance(BaseUserDto, user, {
        excludeExtraneousValues: true,
      });
    });
    return {
      users: userList,
      totalRecords: count,
    };
  }

  async getDeletedUsersAsync() {
    const [rawUsers, count] = await this.usersRepository.findAndCount({
      withDeleted: true,
      where: {
        deletedAt: Not(null),
      },
      order: {
        deletedAt: 'DESC',
      },
    });
    const userList = rawUsers.map((user) => {
      return plainToInstance(BaseUserDto, user, {
        excludeExtraneousValues: true,
      });
    });
    return {
      users: userList,
      totalRecords: count,
    };
  }

  async createUserAsync(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.exists({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) {
      throw new BadRequestException({
        message: 'Email này đã được sử dụng',
      });
    }
    const hashedPassword = await bcrypt.hash(
      SecurityOptions.DEFAULT_PASSWORD,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      hashedPassword,
    });
    const createdUser = await this.usersRepository.save(newUser);
    return plainToInstance(BaseUserDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUserAsync(userId: string, updateData: UpdateUserDto) {
    const isEmailExist = await this.usersRepository.exists({
      where: {
        email: updateData.email,
        id: Not(userId),
      },
    });
    if (isEmailExist) {
      throw new BadRequestException({
        message: 'Email này đã được sử dụng',
      });
    }
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
    return plainToInstance(BaseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUserAsync(userId: string) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
      },
    });
    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }
    await this.usersRepository.softRemove(userInfo);
    return {
      userId: userInfo.id,
    };
  }

  async restoreUserAsync(userId: string) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại hoặc đã được khôi phục',
      });
    }

    await this.usersRepository.restore(userId);
    return {
      userId: userInfo.id,
    };
  }

  async resetPasswordAsync(userId: string) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }
    const hashedPassword = await bcrypt.hash(
      SecurityOptions.DEFAULT_PASSWORD,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );
    const updatedUser = await this.usersRepository.save({
      ...userInfo,
      hashedPassword,
    });
    return {
      userId: updatedUser.id,
    };
  }

  async getUserByIdAsync(userId: string) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại',
      });
    }
    return plainToInstance(BaseUserDto, userInfo, {
      excludeExtraneousValues: true,
    });
  }
}
