all:
	npm install

clean:
	rm -rf node_modules

shm: ./node_modules/osrm/test/data/Makefile
	$(MAKE) -C ./node_modules/osrm/test/data/

test: shm
	npm test

.PHONY: test clean shm