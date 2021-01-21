<p align="center">
  <a href="https://github.com/parasoft/disconnect-server-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Disconnect a server

This action allows you to disconnect a Parasoft Virtualize server from a given Continous Testing Platform endpoint.

## Usage

Add the following to your github workflow yml file with the required inputs.
Password will use a github encrypted secret. Please reference [Encrypted Secrets Documentation](https://docs.github.com/en/actions/reference/encrypted-secrets) on how to create an encrypted secret.

```yaml
uses: parasoft/disconnect-server-action@v1
with:
  ctpUrl: 'http://exampleUrl'
  ctpUsername: 'username'
  ctpPassword: ${{ secrets.password }}
  serverMatch: 'host'
  server: 'localhost'
```

### Input descriptions

**serverMatch:** 
   Used to specify server by host or name\
   Valid values: 'host' or 'name'

**server:**
   Specify server by host or by name according to serverMatch input


## Build and test this action locally

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests
```bash
$ npm test

 PASS  ./index.test.js

...
```