#!/bin/bash
cd /home/ec2-user/tax-calculation
forever start dist/index.js
cd /home/ec2-user/tax-calculation/scripts
