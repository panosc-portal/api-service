import { model, property } from '@loopback/repository';

@model()
export class Provider {
  @property({
    type: 'number',
    id: true,
    required: true
  })
  id: number;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string'
  })
  description?: string;

  @property({
    type: 'number',
    required: true
  })
  url: string;

  constructor(data?: Partial<Provider>) {
    Object.assign(this, data);
  }
}
