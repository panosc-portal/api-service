import { model, property } from '@loopback/repository';
import { User } from '../account-service';
import { InstanceMemberRole } from './';

@model()
export class InstanceMember {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true
  })
  id: number;

  @property({
    type: User,
    required: true
  })
  user: User;

  @property({
    type: 'number',
    required: false
  })
  instanceId: number;


  @property({
    type: 'string'
  })
  role: InstanceMemberRole;

  @property({
    type: 'date',
    required: true
  })
  createdAt: Date;

  constructor(data?: Partial<InstanceMember>) {
    Object.assign(this, data);
  }
}
