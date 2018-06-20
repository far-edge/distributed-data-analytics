#!/bin/bash

# Generates the configuration file (apidoc.json) needed for apiDoc to work.
# Depends on .env and package.json.

# Source the environment.
source .env

# Get the version from package.json.
VERSION=`node -pe "require('./package.json').version"`

# Generate the configuration.
cat > apidoc.json << EOF
{
  "name": "${NAME} REST API",
  "version": "${VERSION}",
  "description": "${NAME} REST API @ ${NODE_ENV}.",
  "title": "${NAME} REST API (${NODE_ENV}).",
  "url": "${API_BASE_URL}",
  "sampleUrl": "${API_BASE_URL}",
  "template": {
    "withCompare": true,
    "withGenerator": true
  },
  "template": {
    "forceLanguage": "en"
  }
}
EOF
