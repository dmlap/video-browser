#!/bin/sh

# Use rel-urls.js to replace assetPrefix tokens so that the resulting
# asset URLs are relative. WebOS does not support domain-relative URLs
# on actual devices
find out -iname "*.html" -or -iname "*.css" -or -iname "*.js" | VDRA_TV=webos xargs -n1 node scripts/rel-urls.js
