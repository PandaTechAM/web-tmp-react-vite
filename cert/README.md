# Self-Signed SSL Certificate Creation and Setup Guide

This guide outlines the process of generating a self-signed wildcard SSL certificate for local development purposes, specifically targeting the domain `*.pandatech.it`. The steps involve using OpenSSL within Ubuntu (WSL), transferring the certificate to Windows, and configuring it to be trusted by the system and browsers like Google Chrome.

## Prerequisites

- Windows Subsystem for Linux (WSL) with Ubuntu installed
- OpenSSL installed in Ubuntu (usually pre-installed)
- Access to Windows administrative tools

## Steps

### 1. Generate Private Key and CSR

Open a terminal in Ubuntu (via WSL) and execute the following command to generate a private key (`panda.key`) and a Certificate Signing Request (`panda.csr`):

```bash
openssl req -newkey rsa:2048 -nodes -keyout panda.key -out panda.csr -subj "/C=IT/ST=Yerevan/L=Yerevan/O=Pandatech/CN=*.pandatech.it"
```

### 2. Create OpenSSL Configuration File

Create a configuration file (`openssl.cnf`) to specify the certificate options, including the subject alternative names (SANs):

```bash
touch openssl.cnf
nano openssl.cnf
```

Paste the following configuration into the file:

```ini
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = IT
ST = Yerevan
L = Yerevan
O = Pandatech
CN = *.pandatech.it

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.pandatech.it
DNS.2 = pandatech.it
```

### 3. Generate Self-Signed Certificate

Generate the self-signed certificate (`panda.crt`) using the CSR and the configuration file:

```bash
openssl x509 -req -in panda.csr -signkey panda.key -out panda.crt -days 365 -extfile openssl.cnf -extensions v3_req
```

### 4. Convert Certificate for Windows

Convert the certificate to PKCS#12 format (`panda.pfx`), which is compatible with Windows. You'll be prompted to set a password for the file:

```bash
openssl pkcs12 -export -out panda.pfx -inkey panda.key -in panda.crt
```

### 5. Transfer to Windows and Install

Transfer all files to windows target folder. Double click `panda.pfx` to start the import process:

- Choose "Local Machine" as the store location.
- Enter the password ("test") you set during the conversion.
- Place the certificate in "`Trusted Root Certification Authorities.`"
- Complete the installation and reload Chrome to apply changes.

### 6. Update Hosts File

For local development (e.g., `react.pandatech.it`), update your Windows hosts file to point the domain to 127.0.0.1.
`host` file is located `\System32\drivers\etc\hosts`.
I have also left bat file which will do the same automatically if you run this bat file as administrator.

### Additional Note

This certificate is issued and valid for 365 days. Don't create long life certificate as it might not be trusted by browser.
