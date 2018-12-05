#!/bin/bash
source /etc/bashrc
source /home/ec2-user/.bashrc
npm install forever -g
sudo chmod -R 777 /usr/local/bin
stop_server.sh
sudo chmod -R 777 /home/ec2-user/tax-calculation
cd /home/ec2-user/tax-calculation
npm install --production
npm run test-back
start_server.sh