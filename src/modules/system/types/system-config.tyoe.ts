import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SystemConfig {
  @ApiProperty()
  @IsNumber()
  @Expose()
  maxLoginAttempts: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePageDocument: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePageBanner: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePagePost: number;

  @ApiProperty()
  @IsString()
  @Expose()
  defaultPassword: string;
}
export class PublicSystemConfig {
  @ApiProperty()
  @IsNumber()
  @Expose()
  maxLoginAttempts: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePageDocument: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePageBanner: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  maxHomePagePost: number;
}
