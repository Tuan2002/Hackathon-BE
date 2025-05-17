import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDocumentDto } from './base-document.dto';

export class DownloadedDocumentDto extends BaseDocumentDto {
  @ApiProperty()
  @Expose()
  downloadedAt?: Date;

  @ApiProperty()
  @Expose()
  downloadedBy?: string;
}
