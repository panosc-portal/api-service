import { model, property } from '@loopback/repository';
import { Employer } from './employer.model';
import { Role } from './role.model';

@model()
export class User {
  @property({
    type: 'number',
    required: true
  })
  id: number;

  @property({
    type: 'string',
    required: true
  })
  firstName: string;

  @property({
    type: 'string',
    required: true
  })
  lastName: string;

  @property({
    type: 'string',
    required: false
  })
  email: string;

  @property({
    type: 'boolean',
    required: true
  })
  activated: boolean;

  @property({
    type: 'date',
    required: true
  })
  lastSeenAt: Date;

  @property({
    type: 'number',
    required: true
  })
  instanceQuota: number;

  @property({ type: Employer })
  affiliation: Employer;

  @property({
    type: 'array',
    itemType: Role
  })
  roles: Role[];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

}
