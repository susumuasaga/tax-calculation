#!/bin/bash
sudo chmod -R 777 /home/ec2-user/tax-calculation
sudo chmod -R 777 /usr/local/bin
cd /home/ec2-user/tax-calculation
npm install forever -g
npm install
npm run test-back
start_server.sh