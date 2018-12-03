#!/bin/bash
uid=$(forever list | grep dist/index.js | awk '{ print $3 }')
if [ "${uid}" ]
then
  $(forever stop ${uid})
fi
