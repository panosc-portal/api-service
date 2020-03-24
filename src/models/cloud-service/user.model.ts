import { model, property } from "@loopback/repository";

@model()
export class User {
  @property({
    type: 'number',
    id: true,
    required: true
  })
  id: number;

  @property({
    type: 'string',
  })
  email: string;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
