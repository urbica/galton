#!/bin/bash

# Usage:
#   ./entrypoint.sh <url> <profile>
#   ./entrypoint.sh "https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf" foot

URL=$1
PBF=${URL##*/}
OSRM=${PBF%%.*}.osrm
PROFILE=${2:-foot}.lua

_sig() {
  kill -TERM $child 2>/dev/null
}

trap _sig SIGKILL SIGTERM SIGHUP SIGINT EXIT

if [ ! -f /data/$OSRM ]; then
  if [ ! -f /extracts/$PBF ]; then
    curl $URL > /extracts/$PBF
  fi
  cp /extracts/$PBF /data/$PBF
  osrm-extract -p /profiles/$PROFILE /data/$PBF
  osrm-contract /data/$OSRM
fi

node /usr/src/galton/index.js /data/$OSRM &
child=$!
wait "$child"
