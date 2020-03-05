export class ApplicationConfig {
  port: string
  accountService: {
    host: string,
    port: string,
  }
  cloudService: {
    host: string,
    port: string,
  }

  logging: {
    level: string
  }

  constructor(data?: Partial<ApplicationConfig>) {
    Object.assign(this, data);
  }
}

let applicationConfig: ApplicationConfig;

export function APPLICATION_CONFIG(): ApplicationConfig {
  if (applicationConfig == null) {
    applicationConfig = {
      port: process.env.API_SERVICE_PORT,
      accountService: {
        host: process.env.API_SERVICE_ACCOUNT_SERVICE_HOST,
        port: process.env.API_SERVICE_ACCOUNT_SERVICE_PORT
      },
      cloudService: {
        host: process.env.API_SERVICE_CLOUD_SERVICE_HOST,
        port: process.env.API_SERVICE_CLOUD_SERVICE_PORT
      },
      logging: {
        level: process.env.API_SERVICE_LOG_LEVEL
      }
    }
  }

  return applicationConfig;
}
