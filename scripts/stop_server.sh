#!/bin/bash
source /home/ec2-user/.nvm/nvm.sh
uid=$(forever list | grep dist/index.js | awk '{ print $3 }')
if [ "${uid}" ]
then
  forever stop ${uid}
fi
