#!/bin/bash
forever=~/.nvm/versions/node/v10.14.1/bin/forever
cd /home/ec2-user/tax-calculation
${forever} start dist/index.js
