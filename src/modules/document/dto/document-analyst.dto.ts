import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DocumentAnalystDto {
  @ApiProperty()
  @Expose()
  userId: string;
  @ApiProperty()
  @Expose()
  documentId: string;
  @ApiProperty()
  @Expose()
  userName: string;
  @ApiProperty()
  @Expose()
  userEmail: string;
  @ApiProperty()
  @Expose()
  avatar: string;
}
