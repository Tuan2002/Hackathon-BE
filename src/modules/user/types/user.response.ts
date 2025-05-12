import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from '../dto/base-user.dto';

export class GetUsersResponse {
  @ApiProperty({ type: () => BaseUserDto, isArray: true })
  users: BaseUserDto[];
  @ApiProperty()
  totalRecords: number;
}
