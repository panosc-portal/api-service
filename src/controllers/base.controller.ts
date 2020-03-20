import { HttpErrors } from '@loopback/rest';
import { CloudServiceResponseError } from '../services';

export class BaseController {
  constructor() { }

  throwNotFoundIfNull(object: any, message?: string) {
    if (object == null) {
      throw new HttpErrors.NotFound(message);
    }
  }

  throwBadRequestIfNull(object: any, message?: string) {
    if (object == null) {
      throw new HttpErrors.BadRequest(message);
    }
  }

  throwBadRequestIfNotEqual(value1: any, value2: any, message?: string) {
    if (value1 !== value2) {
      throw new HttpErrors.BadRequest(message);
    }
  }

  handleCloudServiceResponseError(error: CloudServiceResponseError) {
    if (error.code === 404) {
      throw new HttpErrors.NotFound(error.message);

    } else if (error.code === 400) {
      throw new HttpErrors.BadRequest(error.message);

    } else if (error.code === 401) {
      throw new HttpErrors.Unauthorized(error.message);

    } else {
      throw new HttpErrors.InternalServerError(error.message);
    }
  }
}
