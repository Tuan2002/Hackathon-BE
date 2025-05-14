import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileUploadDto {
  @ApiProperty({ format: 'binary' })
  file: Express.MulterS3.File;
}

export class FileUploadResponseDto {
  @ApiProperty()
  @Expose()
  originalname: string;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  size: number;
}
