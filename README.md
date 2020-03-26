# API Service

[![Actions Status](https://github.com/panosc-portal/api-service/workflows/Node.js%20CI/badge.svg)](https://github.com/panosc-portal/api-service/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The API Service is a micro-service of the PaNOSC Common Portal.

The API Service provides the main point of entry to the PaNOSC Portal application and provides an authenticated facade to APIs of underlying micro services (namely the Cloud Service and Account Service).

User authentication is delegated to the Account Service. An OpenID access token is sent to the API Service in the request header and forwarded to the Account Service. The API Service obtains an account and role from the Account Service which provides a means a determining access to the Cloud Service API endpoints (certain endpoints are for administrative purposes only).

The management of plans (Remote Desktop and Notebook Server images and flavours) and instances is delegated to the Cloud Service. User instances are automatically associated to the account of the connected user.

Further documentation and the design details can be found at [PaNOSC Portal API Service Design](https://confluence.panosc.eu/x/zACm) page.

## Installation
```
 npm install
 ```

## Run
```
npm start
```

### Environment variables

The following environment variables are used to configure the API Service and can be placed in a dotenv file:

| Environment variable | Default value | Usage |
| ---- | ---- | ---- |
| API_SERVICE_ACCOUNT_SERVICE_HOST | | The host of the Account Service micro-service |
| API_SERVICE_ACCOUNT_SERVICE_PORT | | The port of the Account Service micro-service |
| API_SERVICE_CLOUD_SERVICE_HOST | | The host of the Cloud Service micro-service |
| API_SERVICE_CLOUD_SERVICE_PORT | | The port of the Cloud Service micro-service |

