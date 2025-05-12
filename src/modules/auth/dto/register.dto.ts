import { User } from '@modules/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto extends PickType(User, [
  'email',
  'firstName',
  'lastName',
]) {
  @ApiProperty()
  @Expose()
  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  password: string;
}
