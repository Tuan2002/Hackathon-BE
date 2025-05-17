import { Author } from './entities/author.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { BaseAuthorDto } from './dto/base-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async getAllAuthorsAsync() {
    const rawAuthors = await this.authorRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    const authorList = rawAuthors.map((item) => {
      return plainToInstance(BaseAuthorDto, item, {
        excludeExtraneousValues: true,
      });
    });
    return authorList;
  }

  async getDeletedAuthorsAsync() {
    const rawAuthors = await this.authorRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(null),
      },
      order: {
        deletedAt: 'DESC',
      },
    });
    const authorList = rawAuthors.map((author) => {
      return plainToInstance(BaseAuthorDto, author, {
        excludeExtraneousValues: true,
      });
    });
    return authorList;
  }

  async createAuthor(createAuthorData: CreateAuthorDto) {
    const newAuthor = this.authorRepository.create(createAuthorData);
    const createdAuthor = await this.authorRepository.save(newAuthor);
    return plainToInstance(BaseAuthorDto, createdAuthor, {
      excludeExtraneousValues: true,
    });
  }

  async updateAuthorAsync(authorId: string, updateData: UpdateAuthorDto) {
    const isAuthorExist = await this.authorRepository.exists({
      where: {
        name: updateData.name,
        id: Not(authorId),
      },
    });
    if (isAuthorExist) {
      throw new BadRequestException({
        message: 'Tên Nhà xuất bản đã tồn tại',
      });
    }
    const authorInfo = await this.authorRepository.findOne({
      where: { id: authorId },
    });
    if (!authorInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    const updatedAuthor = await this.authorRepository.save({
      ...authorInfo,
      ...updateData,
    });
    return plainToInstance(BaseAuthorDto, updatedAuthor, {
      excludeExtraneousValues: true,
    });
  }

  async deleteAuthorAsync(authorId: string) {
    const authorInfo = await this.authorRepository.findOne({
      where: { id: authorId },
      select: {
        id: true,
      },
    });
    if (!authorInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    await this.authorRepository.softRemove(authorInfo);
    return {
      authorId: authorInfo.id,
    };
  }

  async restoreAuthorAsync(authorId: string) {
    const authorInfo = await this.authorRepository.findOne({
      where: { id: authorId },
      withDeleted: true,
    });
    if (!authorInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại hoặc đã được khôi phục',
      });
    }

    await this.authorRepository.restore(authorId);
    return {
      authorId: authorInfo.id,
    };
  }

  async getAuthorByIdAsync(authorId: string) {
    const authorInfo = await this.authorRepository.findOne({
      where: { id: authorId },
    });
    if (!authorInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    return plainToInstance(BaseAuthorDto, authorInfo, {
      excludeExtraneousValues: true,
    });
  }
}
