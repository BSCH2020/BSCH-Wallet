#!/bin/bash

echo app.bsch.finance > ./web-build/CNAME

gh-pages -d web-build --remote=gh-pages

