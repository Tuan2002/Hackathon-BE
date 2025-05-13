import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BaseBannerDto } from './dto/base-banner.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';
import { Config } from './entities/config.entity';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Config)
    private configsRepository: Repository<Config>,

    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async createBannerAsync(createBannerDto: CreateBannerDto) {
    const banner = this.bannerRepository.create(createBannerDto);
    const createdBanner = await this.bannerRepository.save(banner);
    return plainToInstance(BaseBannerDto, createdBanner, {
      excludeExtraneousValues: true,
    });
  }

  async getAllBanners() {
    const rawBanners = await this.bannerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return rawBanners.map((banner) => {
      return plainToInstance(BaseBannerDto, banner, {
        excludeExtraneousValues: true,
      });
    });
  }

  async getActiveBanners() {
    const rawBanners = await this.bannerRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'ASC',
      },
    });
    return rawBanners.map((banner) => {
      return plainToInstance(BaseBannerDto, banner, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findBannerById(id: string) {
    const banner = await this.bannerRepository.findOneOrFail({ where: { id } });
    return plainToInstance(BaseBannerDto, banner, {
      excludeExtraneousValues: true,
    });
  }

  async updateBannerAsync(id: string, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannerRepository.findOneOrFail({ where: { id } });
    const updatedBanner = await this.bannerRepository.save({
      ...banner,
      ...updateBannerDto,
    });
    return plainToInstance(BaseBannerDto, updatedBanner, {
      excludeExtraneousValues: true,
    });
  }
  async deleteBannerAsync(id: string) {
    const banner = await this.bannerRepository.findOneOrFail({ where: { id } });
    await this.bannerRepository.softDelete(banner.id);
    return {
      message: 'Banner đã được xóa thành công',
    };
  }

  async toggleBannerStatus(id: string) {
    const banner = await this.bannerRepository.findOneOrFail({ where: { id } });
    banner.isActive = !banner.isActive;
    const updatedBanner = await this.bannerRepository.save(banner);
    return plainToInstance(BaseBannerDto, updatedBanner, {
      excludeExtraneousValues: true,
    });
  }
}
