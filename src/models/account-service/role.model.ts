import { model, property } from '@loopback/repository';

@model()
export class Role {
  @property({
    type: 'number',
    required: true
  })
  id: number;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
    required: true
  })
  description: string;

  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  }
}
