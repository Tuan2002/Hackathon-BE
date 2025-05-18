import { SecurityOptions } from '@constants';
import { SystemService } from '@modules/system/system.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { BaseUserDto } from './dto/base-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateUserDto } from './dto/update-user..dto';
import { PointHistory } from './entities/point-history.entity';
import { Transaction } from './entities/transaction.entity';
import { User } from './entities/user.entity';
import { PointAction } from './enums/point-action.enum';
import { PointNote } from './enums/point-note.enum';
import { TransactionStatus } from './enums/transaction-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PointHistory)
    private pointHistoryRepository: Repository<PointHistory>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
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

  async addPointAsync(userId: string, point: number, note: string | PointNote) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại, không thể cộng điểm',
      });
    }

    userInfo.point += point;
    await this.usersRepository.save(userInfo);

    const newPointHistory = this.pointHistoryRepository.create({
      amount: point,
      pointAction: PointAction.INCREASE,
      note,
      historyUserId: userId,
      lastPoint: userInfo.point,
    });
    await this.pointHistoryRepository.save(newPointHistory);

    return {
      userId: userInfo.id,
      point,
    };
  }

  async subtractPointAsync(
    userId: string,
    point: number,
    note: string | PointNote,
  ) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại, không thể trừ điểm',
      });
    }

    if (userInfo.point < point) {
      throw new BadRequestException({
        message: 'Người dùng không đủ điểm trong tài khoản',
      });
    }

    userInfo.point -= point;
    await this.usersRepository.save(userInfo);
    const newPointHistory = this.pointHistoryRepository.create({
      amount: point,
      pointAction: PointAction.DECREASE,
      note,
      historyUserId: userId,
      lastPoint: userInfo.point,
    });
    await this.pointHistoryRepository.save(newPointHistory);

    return {
      userId: userInfo.id,
      point,
    };
  }

  async createTransactionAsync(
    userId: string,
    transactionHash: string,
    amount: number,
  ) {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!userInfo) {
      throw new BadRequestException({
        message: 'Người dùng không tồn tại, không thể tạo giao dịch',
      });
    }

    const newTransaction = this.transactionRepository.create({
      transactionHash,
      amount,
      paymentUserId: userId,
    });
    await this.transactionRepository.save(newTransaction);
    return {
      transactionId: newTransaction.id,
      transactionHash: newTransaction.transactionHash,
    };
  }

  async confirmTransactionAsync(transactionHash: string, amount: number) {
    const transactionInfo = await this.transactionRepository.findOne({
      where: { transactionHash, status: TransactionStatus.PENDING },
    });
    if (!transactionInfo) {
      throw new BadRequestException({
        message: 'Giao dịch không tồn tại',
      });
    }

    const receivedPoint = Math.floor(amount / SecurityOptions.EXCHANGE_RATE);
    transactionInfo.status = TransactionStatus.SUCCESS;

    await this.transactionRepository.save(transactionInfo);
    await this.addPointAsync(
      transactionInfo.paymentUserId,
      receivedPoint,
      PointNote.MONEY_TOP_UP,
    );

    return {
      transactionId: transactionInfo.id,
      transactionHash: transactionInfo.transactionHash,
    };
  }

  async cancelTransactionAsync(transactionHash: string, reason: string) {
    const transactionInfo = await this.transactionRepository.findOne({
      where: { transactionHash },
    });
    if (!transactionInfo) {
      throw new BadRequestException({
        message: 'Giao dịch không tồn tại',
      });
    }

    await this.transactionRepository.save({
      ...transactionInfo,
      status: TransactionStatus.FAILED,
      failedReason: reason,
    });

    return {
      transactionId: transactionInfo.id,
      transactionHash: transactionInfo.transactionHash,
    };
  }

  async getTransactionByUserIdAsync(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { paymentUserId: userId },
      relations: ['paymentUser'],
      order: {
        createdAt: 'DESC',
      },
    });

    return transactions.map((transaction) => {
      return plainToInstance(TransactionDto, transaction, {
        excludeExtraneousValues: true,
      });
    });
  }
}
