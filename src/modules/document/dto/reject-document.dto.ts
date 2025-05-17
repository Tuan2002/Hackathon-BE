import { ApiProperty } from '@nestjs/swagger';

export class RejectDocumentDto {
  @ApiProperty()
  reason: string;
}
