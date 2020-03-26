# api-service

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
Access explorer at: http://localhost:3000/api/v1/explorer/


[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
