all:
	yarn
	yarn run build

clean:
	rm -rf node_modules

shm:
	OSRM_BUILD_DIR=../../lib/binding $(MAKE) all -i -C ./node_modules/osrm/test/data/

test: shm
	yarn test

.PHONY: test clean shm
