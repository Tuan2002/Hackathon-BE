import { ApiProperty } from '@nestjs/swagger';

export class DocumentAnalystDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  documentId: string;
  @ApiProperty()
  userName: string;
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  avatar: string;
}
