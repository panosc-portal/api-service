import { model, property } from '@loopback/repository';
import { Role } from './role.model';

@model()
export class User {
  @property({
    type: 'number',
    required: true
  })
  id: number;

  @property({
    type: 'number',
    required: true
  })
  facilityUserId: number;

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
    type: Role
  })
  role: Role;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

}
