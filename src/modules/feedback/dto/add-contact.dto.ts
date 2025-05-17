import { PickType } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';

export class AddContactDto extends PickType(Contact, [
  'name',
  'email',
  'phone',
  'message',
]) {}
