#!/usr/bin/env bash

npm install

node node_modules/watchify/bin/cmd.js --debug --outfile assets/bundle.js --entry client/PictureApp.js -v &

node_modules/supervisor/lib/cli-wrapper.js --ignore node_modules,assets server/server.js
