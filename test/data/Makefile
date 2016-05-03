
OSRM_RELEASE := $(shell node -e "console.log(require('../../package.json').osrm_release)")

ifeq ($(OSRM_RELEASE),)
$(error OSRM_RELEASE variable was not correct set)
endif

CAR_PROFILE_URL:=https://raw.githubusercontent.com/Project-OSRM/osrm-backend/$(OSRM_RELEASE)/profiles/car.lua
PROFILE_LIB_URL:=https://raw.githubusercontent.com/Project-OSRM/osrm-backend/$(OSRM_RELEASE)/profiles/lib/access.lua
BERLIN_URL:=https://s3.amazonaws.com/mapbox/node-osrm/testing/berlin-latest.osm.pbf

all: berlin-latest.osrm.hsgr

lib/access.lua:
	mkdir -p lib
	wget $(PROFILE_LIB_URL) -O lib/access.lua

car.lua: lib/access.lua
	wget $(CAR_PROFILE_URL) -O car.lua

clean:
	rm -f ./berlin-latest.*
	rm -f ./car.lua
	rm -rf ./lib

berlin-latest.osm.pbf:
	wget $(BERLIN_URL) -O berlin-latest.osm.pbf

berlin-latest.osrm: berlin-latest.osm.pbf car.lua $(OSRM_EXTRACT)
	@echo "Verifiyng data file integrity..."
	md5sum -c data.md5sum
	@PATH="${PATH}:../../lib/binding" && echo "*** Using osrm-extract from `which osrm-extract` ***"
	@echo "Running osrm-extract..."
	@PATH="${PATH}:../../lib/binding" && osrm-extract berlin-latest.osm.pbf -p car.lua

berlin-latest.osrm.hsgr: berlin-latest.osrm car.lua $(OSRM_CONTRACT)
	@PATH="${PATH}:../../lib/binding" && echo "*** Using osrm-contract from `which osrm-contract` ***"
	@echo "Running osrm-contract..."
	@PATH="${PATH}:../../lib/binding" && osrm-contract berlin-latest.osrm

checksum:
	md5sum lib/access.lua car.lua berlin-latest.osm.pbf > data.md5sum

.PHONY: clean checksum
