#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

cd "`dirname $0`" && SCRIPTDIR=`pwd` && cd -
cd "`dirname $0`/.." && DOVEDIR=`pwd` && cd -

cd ${DOVEDIR}/dove-rest
mvn clean package

cd ${DOVEDIR}/dove-vue
source /home/daniele/.nvm/nvm.sh
nvm use 22
npm ci
npm run build
