all:
	npm install
	npm run build

clean:
	rm -rf node_modules

shm:
	$(MAKE) -C ./node_modules/osrm/
	$(MAKE) all -k -C ./node_modules/osrm/test/data/

test: shm
	npm test

.PHONY: test clean shm
