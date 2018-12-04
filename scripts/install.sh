#!/bin/bash
npm install forever -g
stop_server.sh
sudo chmod -R 777 /home/ec2-user/tax-calculation
cd /home/ec2-user/tax-calculation
npm install --production
npm run test-back
start_server.sh