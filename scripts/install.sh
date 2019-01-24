#!/bin/bash
source /home/ec2-user/.nvm/nvm.sh
npm install forever -g
chmod 755 /etc/init.d/tax-calculation
service tax-calculation stop
chmod -R 755 /home/ec2-user/tax-calculation
cd /home/ec2-user/tax-calculation
npm install --production
npm run test-back
service tax-calculation start
