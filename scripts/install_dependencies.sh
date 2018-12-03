#!/bin/bash
cd /home/ec2-user/tax-calculation
npm=~/.nvm/versions/node/v10.14.1/bin/npm
sudo chmod -R 666 .
sudo chmod -R 555 /usr/local/bin
${npm} install forever -g
${npm} install
