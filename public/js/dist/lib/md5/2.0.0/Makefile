version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@spm install

build:
	@zpm build

publish: publish-doc
	@spm publish
	@git tag $(version)
	@git push origin $(version)

build-doc:
	@spm doc build

watch:
	@spm doc watch

publish-doc: clean
	@spm doc publish

clean:
	@rm -fr _site


runner = _site/tests/runner.html

test:
	@spm test

output = _site/coverage.html
coverage: build-doc
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@mocha-browser ${runner}?cov -S -R html-cov > ${output}
	@echo "Build coverage to ${output}"


.PHONY: build-doc publish-doc server clean test coverage
