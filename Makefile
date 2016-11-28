all:
	npm install
	npm run build

clean:
	rm -rf node_modules

shm:
	$(MAKE) all -i -C ./node_modules/osrm/test/data/

test: shm
	npm test

.PHONY: test clean shm
