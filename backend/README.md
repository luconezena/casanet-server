# Casanet server - backend

This is the casa-net local server to communicate and control IoT devices in a home.

[![Build Status](https://travis-ci.org/casanet/casanet-server.svg?branch=master)](https://travis-ci.org/casanet/casanet-server)
[![Coverage Status](https://coveralls.io/repos/github/casanet/casanet-server/badge.svg?branch=master)](https://coveralls.io/github/casanet/casanet-server?branch=master)

### Server installation

1. Download the project via git or download files as a zip
1. In Linux OS, make sure `net-tools` installed
1. Install Node.js on the machine
1. Navigate in a command line to `$/casanet-server/backend` and press `npm ci`
1. Run `npm run build` command
1. If you wish to access the dashboard using the local network, build the frontend too
    1. Navigate in a command line to `$/casanet-server/frontend` and press `npm ci`
    1. Run `npm run build:internal` command
    1. Navigate back to `$/casanet-server/backend`
1. Press `node dist/index.js` to run the server.

Then open the browser in `http://127.0.0.1`.

### Configure server

The configuration is based on the environment variable.

All variables with example value placed in the [.env.example](./.env.example) file.

You can load the environment using a `.env` file.

Also in the `casanet.json` file, you can edit the configuration of a few stuff (if not set by the environments variables).

#### Default user

Can edit any property of the default user.

Except for the user account in the email. this will be always the mac address of the machine.
(The reason is for security, the only owner of the machine should know the default username).

#### HTTP/HTTPS server ports

You can edit port and HTTPS using.
Also can set it by environment variables:

- `HTTP_PORT`
- `HTTPS_PORT`
- `USE_HTTPS`

> HTTPS require `private.key` `certificate.crt` and `ca_bundle.crt` files to be in `$/.../backend/encryption/` directory.

#### Requests limit

To block brute-force attacks there is a request limit per IP.

#### Home position

To allows timings based on sun events (such as turn on a light in the sunset) the server needs to know the location area of the home.
It doesn't need to be the exact location but needs to be close enough.

To get your home latitude and longitude you can use https://www.latlong.net/.

#### Password hash salt

set `SALT_KEYS` env var for salt sessions hash. otherways the salt will generate randomly on runtime, and in the next running, all sessions will be invalid.

#### Specify devices network

set `SUBNET_TO_SCAN` env var to specify the network to scan devices IP's in it. the format is `xxx.xxx.xxx`.

if not set, the default network is the first current machine IP subnet.

#### Specify physical address

set `PHYSICAL_ADDRESS` env var to specify the physical (aka MAC) address to use.
if not set, the address will be the first real machine address.

#### Two factor authentication (MFA)

To Allows MFA protection the server needs access to the email account to send the code to user email before login is done.

Let's take for example how to configure a Gmail account: (Of course, it will work for any other SMTP services).

First needs to turn on the IMAP/SMTP access service for the account, [see google instructions](https://support.google.com/mail/answer/7126229) and follow `Step 1` only.

If MFA is enabled for the Gmail account to create an application key for the password. [see google instructions](https://support.google.com/accounts/answer/185833).

And use the following environment variables:

- `TFA_SMTP_SERVER` (value example: `smtp.gmail.com`)
- `TFA_USER_NAME` (value example: `my-usename@gmail.com`)
- `TFA_USER_KEY` (value example: `my-gmail-password or my-application-password`)

that's all.

## Devices connection

Each IoT device should be connected to the local network before it can add it to the casa-net server.
For each supported IoT device model connection and pairing instructions see [modules documentation](./src/modules/README.md).

## Fetch RF (IR / 433MHz etc.) commands from a commands repository

When using RF transmitter to control home devices it's possible to record the command from the original remote control or generating random command.
So to avoid recording a lot of commands one by one there is another project to store commands and serve then on demand. see the [project page](https://github.com/casanet/rf-commands-repo).
The `rf-commands-repo` URL placed in the `casanet.json` configuration file.

If you want to update my repo, feel free to contact me.

## Version update
There is an API to update the version to the latest release.

To run a command after the files update to apply changes,
set your command in `RESET_MACHINE_ON_VERSION_UPDATE` environment, and the backend will invoke it after version update.
Usually, it is something like `sudo reboot` etc.

*THIS IS A DANGEROUS ACTION! BE SURE THAT KNOW WHAT IT WILL HAPPENED WHEN THIS COMMAND WILL EXECUTED*

## Default Lock Calibration Sampling 

The default lock calibration activation (used by timings and operation set lock).

You can edit in the `defaultLockCalibrationMinutes` field in the `casanet.json` configuration file.

## API

The UI should wrap API.

The full specs of API are documented in [swagger API file](./swagger.yaml).
