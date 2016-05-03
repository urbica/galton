#http://www.gnu.org/prep/standards/html_node/Standard-Targets.html#Standard-Targets

all:
	npm install

clean:
	rm -rf node_modules
	$(MAKE) -C ./test/data clean

shm: ./test/data/Makefile
	$(MAKE) -C ./test/data

test: shm
	npm test

.PHONY: test clean shm