OSRM_RELEASE=v4.9.0
CAR_PROFILE_URL:=https://raw.githubusercontent.com/Project-OSRM/osrm-backend/$(OSRM_RELEASE)/profiles/car.lua
PROFILE_LIB_URL:=https://raw.githubusercontent.com/Project-OSRM/osrm-backend/$(OSRM_RELEASE)/profiles/lib/access.lua
BERLIN_URL:=https://s3.amazonaws.com/mapbox/node-osrm/testing/berlin-latest.osm.pbf
OSRM_EXTRACT:=$(TOOL_ROOT)/osrm-extract
OSRM_PREPARE:=$(TOOL_ROOT)/osrm-prepare

all: berlin-latest.osrm.hsgr

lib/access.lua:
	mkdir -p lib
	wget $(PROFILE_LIB_URL) -O lib/access.lua

car.lua: lib/access.lua
	wget $(CAR_PROFILE_URL) -O car.lua

clean:
	rm berlin-latest.*

berlin-latest.osm.pbf:
	wget $(BERLIN_URL) -O berlin-latest.osm.pbf

berlin-latest.osrm: berlin-latest.osm.pbf car.lua $(OSRM_EXTRACT)
	@echo "Verifiyng data file integrity..."
	md5sum -c data.md5sum
	@echo "Running osrm-extract..."
	$(OSRM_EXTRACT) berlin-latest.osm.pbf -p car.lua

berlin-latest.osrm.hsgr: berlin-latest.osrm car.lua $(OSRM_PREPARE)
	@echo "Running osrm-prepare..."
	$(OSRM_PREPARE) berlin-latest.osrm -p car.lua

checksum:
	md5sum lib/access.lua car.lua berlin-latest.osm.pbf > data.md5sum

.PHONY: clean checksum