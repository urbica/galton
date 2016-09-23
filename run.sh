#!/bin/bash

# Usage:
#   ./run.sh <url> <profile>
#   ./run.sh "https://s3.amazonaws.com/metro-extracts.mapzen.com/moscow_russia.osm.pbf" foot

URL=$1
PBF=${URL##*/}
OSRM=${PBF%%.*}.osrm
PROFILE=${2:-foot}.lua

_sig() {
  kill -TERM $child 2>/dev/null
}

trap _sig SIGKILL SIGTERM SIGHUP SIGINT EXIT

if [ ! -f $OSRM ]; then
  if [ ! -f $PBF ]; then
    curl $URL > $PBF
  fi
  osrm-extract -p profiles/$PROFILE $PBF
  osrm-contract $OSRM
  osrm-datastore $OSRM
  rm $PBF
fi

galton $OSRM --sharedMemory &
child=$!
wait "$child"