#!/bin/sh

# Modify NextJS's route loader so that it uses relative URLs in
# production mode to load CSS and JS for client-side navigation. When
# running off the file:// protocol or in the execution context of
# WebOS, domain-relative URLs don't resolve
# This is applied before doing a static export so the patched code
# should always be pulled in. If that doesn't appear to be the case,
# try deleting .next/cache in the root of the project directory
patch --backup --forward node_modules/next/dist/client/route-loader.js --input=src/route-loader.diff
