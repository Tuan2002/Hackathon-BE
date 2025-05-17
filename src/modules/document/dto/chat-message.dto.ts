import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class ChatMessageDto {
  @IsUUID()
  @IsOptional()
  @ValidateIf((o) => o.documentId !== undefined)
  documentId?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.message !== undefined)
  message?: string;
}
