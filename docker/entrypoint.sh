#!/bin/sh

# Check the value of NODE_ENV
if [ "$NODE_ENV" = "production" ]; then
  bun $APP_TYPE/apps/$APP_TYPE/src/main.js
else
  bun install
  pm2 start "bun start:dev admin" --name "admin"
  pm2 start "bun start:dev vendor" --name "vendor"
  pm2 start "bun start:dev customer" --name "customer"
  # Start PM2 logs
  pm2 logs
fi
