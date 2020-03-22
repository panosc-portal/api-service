export class APIResponseError extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}

