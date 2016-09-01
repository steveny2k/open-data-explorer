#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == "master" ] || [ $TRAVIS_BRANCH == "develop" ]; then
  npm run build;
else
  echo "not building"
fi
