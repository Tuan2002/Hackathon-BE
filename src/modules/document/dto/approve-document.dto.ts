import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class ApproveDocumentDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  @Min(0)
  point: number;
}
