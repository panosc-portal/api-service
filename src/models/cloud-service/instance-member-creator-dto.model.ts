import { model, property } from '@loopback/repository';
import { InstanceMemberRole } from '.';
import { User } from './user.model';

@model()
export class InstanceMemberCreatorDto {
  @property({ type: User })
  user: User;

  @property({ type: 'string' })
  role: InstanceMemberRole;

  constructor(data?: Partial<InstanceMemberCreatorDto>) {
    Object.assign(this, data);
  }
}
