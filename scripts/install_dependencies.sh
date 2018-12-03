#!/bin/bash
cd /home/ec2-user/tax-calculation
sudo chmod -R 666 tax-calculation
sudo chmod -R 111 /usr/local/bin
npm install forever -g
npm install
