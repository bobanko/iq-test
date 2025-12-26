# iq-test

iq test with generated questions

## Links

### live

https://420iq.lol

### Demo

https://bobanko.github.io/iq-test/

## tips

### to run local

% http-server . -c-1

### to publish on hosting

% firebase deploy

if fails, re-login first:

% firebase login --reauth

### deployment timestamp

- A predeploy hook writes `version.json` with the deployment timestamp.
- Check the footer on the landing page to see when the current version was deployed.
