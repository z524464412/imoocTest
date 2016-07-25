version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

REPORTER = dot

install:
	@spm install

build:
	@spm build

publish: publish-doc
	@spm publish
	@git tag $(version)
	@git push origin $(version)

build-doc:
	@spm doc build

watch:
	@spm doc watch

publish-doc:
	@spm doc publish

clean:
	@rm -fr _site


build-origin: socket.io.js

socket.io.js: lib/*.js package.json
	@./support/browserify.sh > socket.io.js

test:
	@./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail \
		test/index.js
	@./node_modules/.bin/zuul -- test/index.js

test-cov:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- \
		--reporter $(REPORTER) \
		test/

.PHONY: test
