# How to publish math.js

This document describes the steps required to publish a new version of math.js.


## Update version number

Update the version number in both package.json, bower.json, and component.json.


## Update history

Update the date and version number in the file HISTORY.md. Verify whether all
changes in the new version are described.


## Build library

Build the distribution files ./dist/math.js and ./dist/math.min.js by running:

    npm run build

After the build is complete, verify if the files are created and contain the
correct date and version number in the header.

To update the reference documentation, run:

    npm run docs

This will regenerate all documentation in docs/reference/functions from the
functions code comments.


## Test

Test whether the library works correctly by running the tests:

    npm test

Test whether the npm library is ok by installing it locally:

    cd ../tmp-folder
    npm install ../mathjs

Check whether the library works and looks ok.


## Commit

- Commit the final code.
- Merge the develop branch into the master branch.
- Push to github.

Now go to travis-ci and verify if the tests run fine there as well:

  https://travis-ci.org/josdejong/mathjs

If everything is well, create a tag for the new version, like:

    git tag v1.2.4
    git push --tags


## Publish

Publish to npm:

    npm publish

Publish to jam.js:

    jam publish

No need to publish for bower: The library is already published because of the
new version tag. There is also no need to publish a component(1) build, because
component(1) uses GitHub as it's registry.

Publish at http://jspkg.com: go to the website, select the github project,
select the new version and press the button.

Publish at cdnjs: test after 30 to 60 minutes whether the new version is
published at cdnjs (should auto update).


## Test published libraries

Install the libraries locally and test whether they work correctly:

    cd tmp-folder
    npm install mathjs
    bower install mathjs


## Update the website

Wait until the new version of math.js is available on cdnjs.org.

The website is located in the `gh-pages` branch of the project.
Follow the readme in the `gh-pages` branch on how to update the website.


## Update version number

Switch to the develop branch, and update the version numbers in package.json and
bower.json to a new snapshot version, like

    1.2.5-SNAPSHOT

commit and push the changes.


## Done

Time to drink a beer.

