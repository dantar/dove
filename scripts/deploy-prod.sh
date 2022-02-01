#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

HACKGIT=~/hack/git
NGDIR=$HACKGIT/dove/dove-pwa
APPDIR=$HACKGIT/dove/dove-rest
APPNAME=dantar-dove
REMOTE="ssh dantar "

# build
cd $APPDIR
mvn clean install -P production

cd $NGDIR
ng build --configuration=production --base-href=./

#deploy
$REMOTE sudo /etc/init.d/$APPNAME stop
scp $APPDIR/target/dove-rest.jar dantar:services/$APPNAME.jar
$REMOTE sudo /etc/init.d/$APPNAME start

rsync --delete -varzh $NGDIR/dist/dove-pwa/* dantar:/home/daniele/html/dove/

