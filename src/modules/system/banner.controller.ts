import { Controller } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('banners')
export class BannerController {
  constructor(private readonly systemService: SystemService) {}
}
