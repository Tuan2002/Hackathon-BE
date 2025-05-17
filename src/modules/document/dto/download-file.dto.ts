import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DownloadFileDto {
  @ApiProperty()
  @Expose()
  url: string;
  @ApiProperty()
  @Expose()
  expiresAt: Date;
}
