import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@base/decorators/auth.decorator';

@ApiTags('user')
@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
