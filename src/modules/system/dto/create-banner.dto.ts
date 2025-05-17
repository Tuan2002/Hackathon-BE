import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
