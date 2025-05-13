import { SecurityOptions } from '@constants';
import { SystemService } from '@modules/system/system.service';
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
    private systemService: SystemService,
  ) {}

  async getAllUsersAsync() {
    const rawUsers = await this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    const userList = rawUsers.map((user) => {
      return plainToInstance(BaseUserDto, user, {
        excludeExtraneousValues: true,
      });
    });
    return userList;
  }

  async getDeletedUsersAsync() {
    const rawUsers = await this.usersRepository.find({
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
    return userList;
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
    const activeConfig = await this.systemService.getFullActiveConfigAsync();
    const hashedPassword = await bcrypt.hash(
      activeConfig?.config?.defaultPassword ?? SecurityOptions.DEFAULT_PASSWORD,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      userName: createUserDto.email,
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
