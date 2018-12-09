#!/bin/bash
source /home/ec2-user/.nvm/nvm.sh
cd /home/ec2-user/tax-calculation
forever start dist/index.js
