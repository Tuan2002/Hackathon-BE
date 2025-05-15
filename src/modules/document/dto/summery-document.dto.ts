import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SummaryDocumentDto {
  @ApiProperty({ description: 'Nội dung tóm tắt' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'Id tài liệu' })
  @Expose()
  documentId: string;
}
