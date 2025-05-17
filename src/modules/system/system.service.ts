import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BaseBannerDto } from './dto/base-banner.dto';
import { BaseConfigDto } from './dto/base-config.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { PublicConfigDto } from './dto/public-config.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
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
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Không tìm thấy banner');
    }
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

  async createConfigAsync(createConfigDto: CreateConfigDto) {
    console.log(createConfigDto);
    const config = this.configsRepository.create(createConfigDto);
    const createdConfig = await this.configsRepository.save(config);
    return plainToInstance(BaseConfigDto, createdConfig, {
      excludeExtraneousValues: true,
    });
  }

  async getAllConfigs() {
    const rawConfigs = await this.configsRepository.find();
    return rawConfigs.map((config) => {
      return plainToInstance(BaseConfigDto, config, {
        excludeExtraneousValues: true,
      });
    });
  }

  async getActiveConfigAsync() {
    const config = await this.configsRepository.findOne({
      where: { isActive: true },
    });
    if (!config) {
      throw new NotFoundException('Không tìm thấy cấu hình');
    }
    return plainToInstance(PublicConfigDto, config, {
      excludeExtraneousValues: true,
    });
  }

  async getFullActiveConfigAsync() {
    const config = await this.configsRepository.findOne({
      where: { isActive: true },
    });
    if (!config) {
      return null;
    }
    return plainToInstance(BaseConfigDto, config, {
      excludeExtraneousValues: true,
    });
  }

  async getConfigById(id: string) {
    const config = await this.configsRepository.findOneOrFail({
      where: { id },
    });
    if (!config) {
      throw new NotFoundException('Không tìm thấy cấu hình');
    }
    return plainToInstance(BaseConfigDto, config, {
      excludeExtraneousValues: true,
    });
  }

  async updateConfigAsync(id: string, updateConfigDto: UpdateConfigDto) {
    const config = await this.configsRepository.findOne({
      where: { id },
    });
    if (!config) {
      throw new NotFoundException('Không tìm thấy cấu hình');
    }
    const updatedConfig = await this.configsRepository.save({
      ...config,
      ...updateConfigDto,
    });
    return plainToInstance(BaseConfigDto, updatedConfig, {
      excludeExtraneousValues: true,
    });
  }

  async setActiveConfigAsync(id: string) {
    const currentConfig = await this.configsRepository.findOne({
      where: { id },
    });
    if (!currentConfig) {
      throw new NotFoundException('Không tìm thấy cấu hình');
    }

    const configs = await this.configsRepository.find({
      where: { isActive: true },
    });

    await Promise.all(
      configs.map((config) => {
        config.isActive = false;
        return this.configsRepository.save(config);
      }),
    );

    currentConfig.isActive = true;
    const updatedConfig = await this.configsRepository.save(currentConfig);
    return plainToInstance(BaseConfigDto, updatedConfig, {
      excludeExtraneousValues: true,
    });
  }

  async deleteConfigAsync(id: string) {
    const config = await this.configsRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException('Không tìm thấy cấu hình');
    }
    await this.configsRepository.softDelete(config.id);
    return {
      message: 'Cấu hình đã được xóa thành công',
    };
  }
}
