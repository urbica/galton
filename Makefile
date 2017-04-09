all:
	yarn
	yarn run build

clean:
	rm -rf node_modules

shm:
	$(MAKE) all -i -C ./node_modules/osrm/test/data/

test: shm
	yarn test

.PHONY: test clean shm
