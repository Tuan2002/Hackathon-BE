import { Publisher } from './entities/publisher.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { BasePublisherDto } from './dto/base-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private publisherRepository: Repository<Publisher>,
  ) {}

  async getAllPublishersAsync() {
    const rawPublishers = await this.publisherRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    const publisherList = rawPublishers.map((item) => {
      return plainToInstance(BasePublisherDto, item, {
        excludeExtraneousValues: true,
      });
    });
    return publisherList;
  }

  async getDeletedPublishersAsync() {
    const rawPublishers = await this.publisherRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(null),
      },
      order: {
        deletedAt: 'DESC',
      },
    });
    const publisherList = rawPublishers.map((publisher) => {
      return plainToInstance(BasePublisherDto, publisher, {
        excludeExtraneousValues: true,
      });
    });
    return publisherList;
  }

  async createPublisher(createPublisherData: CreatePublisherDto) {
    const newPublisher = this.publisherRepository.create(createPublisherData);
    const createdPublisher = await this.publisherRepository.save(newPublisher);
    return plainToInstance(BasePublisherDto, createdPublisher, {
      excludeExtraneousValues: true,
    });
  }

  async updatePublisherAsync(
    publisherId: string,
    updateData: UpdatePublisherDto,
  ) {
    const isPublisherExist = await this.publisherRepository.exists({
      where: {
        name: updateData.name,
        id: Not(publisherId),
      },
    });
    if (isPublisherExist) {
      throw new BadRequestException({
        message: 'Tên Nhà xuất bản đã tồn tại',
      });
    }
    const publisherInfo = await this.publisherRepository.findOne({
      where: { id: publisherId },
    });
    if (!publisherInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    const updatedPublisher = await this.publisherRepository.save({
      ...publisherInfo,
      ...updateData,
    });
    return plainToInstance(BasePublisherDto, updatedPublisher, {
      excludeExtraneousValues: true,
    });
  }

  async deletePublisherAsync(publisherId: string) {
    const publisherInfo = await this.publisherRepository.findOne({
      where: { id: publisherId },
      select: {
        id: true,
      },
    });
    if (!publisherInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    await this.publisherRepository.softRemove(publisherInfo);
    return {
      publisherId: publisherInfo.id,
    };
  }

  async restorePublisherAsync(publisherId: string) {
    const publisherInfo = await this.publisherRepository.findOne({
      where: { id: publisherId },
      withDeleted: true,
    });
    if (!publisherInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại hoặc đã được khôi phục',
      });
    }

    await this.publisherRepository.restore(publisherId);
    return {
      publisherId: publisherInfo.id,
    };
  }

  async getPublisherByIdAsync(publisherId: string) {
    const publisherInfo = await this.publisherRepository.findOne({
      where: { id: publisherId },
    });
    if (!publisherInfo) {
      throw new BadRequestException({
        message: 'Nhà xuất bản không tồn tại',
      });
    }
    return plainToInstance(BasePublisherDto, publisherInfo, {
      excludeExtraneousValues: true,
    });
  }
}
