import { model, property } from '@loopback/repository';
import { Provider } from './provider.model';

@model()
export class Plan {
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

  @property({ type: Provider })
  provider: Provider;

  @property({
    type: 'number'
  })
  imageId: number;

  @property({
    type: 'number'
  })
  flavourId: number;

  constructor(data?: Partial<Plan>) {
    Object.assign(this, data);
  }
}
