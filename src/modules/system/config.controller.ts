import { Controller } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('configs')
export class ConfigController {
  constructor(private readonly systemService: SystemService) {}
}
