import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
