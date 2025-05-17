import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddFeedbackDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  star: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  content?: string;
}
