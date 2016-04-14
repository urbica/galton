#http://www.gnu.org/prep/standards/html_node/Standard-Targets.html#Standard-Targets

TOOL_ROOT?=$(shell pwd)/node_modules/osrm/lib/binding
OSRM_DATASTORE:=$(TOOL_ROOT)/osrm-datastore
export TOOL_ROOT
export OSRM_DATASTORE

all:
	npm install

clean:
	rm -rf node_modules
	$(MAKE) -C ./test/data clean

shm: ./test/data/Makefile
	$(MAKE) -C ./test/data
	$(OSRM_DATASTORE) ./test/data/berlin-latest.osrm

test: shm
	npm test

.PHONY: test clean shm