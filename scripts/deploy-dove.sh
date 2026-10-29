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

# cd "${DOVEDIR}/docker" && docker compose build && cd -
APPDIR="dantar:/home/daniele/apps/dove"

# frontend
rsync --delete -varzh ${DOVEDIR}/dove-vue/dist/ ${APPDIR}/docker/frontend/dist
# backend
rsync -varzh ${DOVEDIR}/dove-rest/target/dove-rest.jar ${APPDIR}/docker/backend
# database
rsync -varzh ${DOVEDIR}/database/init/* ${APPDIR}/docker/database/init
# flyway
rsync --delete -varzh ${DOVEDIR}/flyway/sql/ ${APPDIR}/docker/flyway/sql

rsync \
    -varzh ${DOVEDIR}/deploy/* \
    ${APPDIR}/docker/

REMOTE="ssh dantar"
$REMOTE docker compose -f apps/dove/docker/docker-compose.yml up -d --build --remove-orphans