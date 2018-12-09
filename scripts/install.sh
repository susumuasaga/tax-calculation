#!/bin/bash
source /home/ec2-user/.nvm/nvm.sh
npm install forever -g
chmod -R 755 /usr/local/bin
/usr/local/bin/stop_server.sh
chmod -R 644 /home/ec2-user/tax-calculation
cd /home/ec2-user/tax-calculation
npm install --production
npm run test-back
/usr/local/bin/start_server.sh
chmod 755 /etc/init.d/tax-calculation
