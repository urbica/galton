DATA_NAME:=monaco
DATA_URL:=https://s3.amazonaws.com/mapbox/osrm/testing/$(DATA_NAME).osm.pbf
DATA_POLY_URL:=https://s3.amazonaws.com/mapbox/osrm/testing/$(DATA_NAME).poly
OSRM_BUILD_DIR=../../node_modules/osrm/lib/binding
PROFILE_ROOT:=../../node_modules/osrm/profiles
OSRM_EXTRACT:=$(OSRM_BUILD_DIR)/osrm-extract
OSRM_CONTRACT:=$(OSRM_BUILD_DIR)/osrm-contract
PROFILE:=$(PROFILE_ROOT)/car.lua

all:
	wget $(DATA_URL) -O $(DATA_NAME).osm.pbf
	@echo "Running osrm-extract..."
	$(OSRM_EXTRACT) -p $(PROFILE) $(DATA_NAME).osm.pbf
	@echo "Running osrm-contract..."
	$(OSRM_CONTRACT) $(DATA_NAME).osrm

clean:
	-rm -r $(DATA_NAME).*

.PHONY: clean all
