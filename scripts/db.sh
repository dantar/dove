#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

ssh -L 25432:localhost:25432 dantar \
    docker run --rm \
    --network dove_default \
    -p 25432:5432 \
    alpine/socat \
    tcp-listen:5432,fork,reuseaddr tcp-connect:database:5432
