import { model, property } from '@loopback/repository';
import { Role } from './role.model';

@model()
export class Account {
  @property({
    type: 'number',
    required: true
  })
  id: number;

  @property({
    type: 'number',
    required: true
  })
  userId: number;

  @property({
    type: 'string',
    required: true
  })
  username: string;

  @property({
    type: 'string'
  })
  email: string;

  @property({
    type: 'string'
  })
  homePath: string;

  @property({
    type: 'number'
  })
  uid: number;

  @property({
    type: 'number'
  })
  gid: number;

  @property({
    type: 'boolean'
  })
  active: boolean;

  @property({
    type: 'array',
    itemType: Role
  })
  roles: Role[];

  constructor(data?: Partial<Account>) {
    Object.assign(this, data);
  }

}
