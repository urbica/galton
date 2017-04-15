#!/bin/bash

# Usage:
#   ./entrypoint.sh <url> <profile>
#   ./entrypoint.sh "https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf" foot

URL=$1
PBF=${URL##*/}
OSRM=${PBF%%.*}.osrm
PROFILE=${2:-foot}.lua
INSTANCES=${GALTON_INSTANCES:-1}
OSRM_PATH=/usr/src/app/node_modules/osrm

if [ ! -f /data/$OSRM ]; then
  if [ ! -f /extracts/$PBF ]; then
    curl $URL > /extracts/$PBF
  fi
  if [ ! -f /data/$PBF ]; then
    ln -s /extracts/$PBF /data/$PBF
  fi
  $OSRM_PATH/lib/binding/osrm-extract -p $OSRM_PATH/profiles/$PROFILE /data/$PBF
  $OSRM_PATH/lib/binding/osrm-contract /data/$OSRM
fi

pm2-docker --auto-exit -i $INSTANCES /usr/src/app/index.js -- /data/$OSRM
