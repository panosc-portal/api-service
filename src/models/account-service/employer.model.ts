import { model, property } from '@loopback/repository';

@model()
export class Employer {
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
  town: string;

  @property({
    type: 'string',
    required: true
  })
  countryCode: string;

  constructor(data?: Partial<Employer>) {
    Object.assign(this, data);
  }

}
