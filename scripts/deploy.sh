#!/bin/bash
case $1 in
  production)
    rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/build git@jyps.fi:/usr/share/nginx/tapahtumat.jyps.fi
    ;;
esac
