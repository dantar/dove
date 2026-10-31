#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

cd "`dirname $0`" && SCRIPTDIR=`pwd` && cd -
cd "`dirname $0`/.." && DOVEDIR=`pwd` && cd -

for ARTIFACT in "${DOVEDIR}/dove-vue/dist/index.html" "${DOVEDIR}/dove-rest/target/dove-rest.jar"; do
    if [ ! -f "${ARTIFACT}" ]; then
        echo "Missing ${ARTIFACT}: run scripts/build-dove.sh first" >&2
        exit 1
    fi
done

APPDIR="dantar:/opt/web/dove"

# compose file and docker build contexts (swag/ is a reference copy for /opt/swag)
rsync \
    -varzh ${DOVEDIR}/deploy/* \
    --exclude swag \
    ${APPDIR}/
# frontend
rsync --delete -varzh ${DOVEDIR}/dove-vue/dist/ ${APPDIR}/frontend/dist
# backend
rsync -varzh ${DOVEDIR}/dove-rest/target/dove-rest.jar ${APPDIR}/backend
# database
rsync -varzh ${DOVEDIR}/database/init/* ${APPDIR}/database/init
# flyway
rsync --delete -varzh ${DOVEDIR}/flyway/sql/ ${APPDIR}/flyway/sql

REMOTE="ssh dantar"
$REMOTE docker compose -f /opt/web/dove/docker-compose.yml up -d --build --remove-orphans
