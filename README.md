<p align="center">
  <a href="https://github.com/parasoft/disconnect-server-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Disconnect a server

This action disconnects a Parasoft Virtualize server from a given Continous Testing Platform endpoint.

## Usage

Add the following entry to your Github workflow YAML file with the required inputs:
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

### Required Inputs 
The following inputs are required for this action:

| Input | Description |
| --- | --- |
| `ctpURL` | Specifies the Continuous Testing Platform endpoint where the environment will be deployed. |
| `ctpUsername` | Specifies a user name for accessing the Continuous Testing Platform endpoint. |
| `ctpPassword` | Specifies a Github encrypted secret for accessing the Continuous Testing Platform endpoint. Refer to the [Encrypted Secrets Documentation](https://docs.github.com/en/actions/reference/encrypted-secrets) for details on how to create an encrypted secret. |
| `serverMatch` | Specifies how to identify the server to disconnect. The following strings are valid: <ul><li>`host`: Configures the action to identify the host by IP.</li><li>`name`: Confiugres the action to identify the host by name.</li></ul> |
| `server` |  Specifies either the host name or IP address to disconnect depending on the `serverMatch` input configuration. |


## Build and Test this Action Locally

1. Install the dependencies:

```bash
$ npm install
```

2. Build the typescript and package it for distribution: 

```bash
$ npm run build && npm run package
```

3. Run the tests:

```bash
$ npm test

 PASS  ./index.test.js

...
```
