import { model, property } from '@loopback/repository';
import { Plan } from './plan.model';
import { InstanceMember } from './instance-member.model';

@model()
export class Instance {
  @property({
    type: 'number',
    id: true,
    required: true
  })
  id: number;

  @property({
    type: 'number'
  })
  cloudId: number;

  @property({ type: Plan })
  plan: Plan;

  @property({
    type: 'array',
    itemType: 'object'
  })
  members: InstanceMember[];

  @property({
    type: 'date',
    required: true
  })
  createdAt: Date;

  updatedAt: Date;

  deleted: boolean;

  constructor(data?: Partial<Instance>) {
    Object.assign(this, data);
  }

}
