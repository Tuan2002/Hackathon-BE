import { PickType } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';

export class ContactDto extends PickType(Contact, [
  'id',
  'name',
  'email',
  'phone',
  'message',
  'isReplied',
  'createdAt',
]) {}
