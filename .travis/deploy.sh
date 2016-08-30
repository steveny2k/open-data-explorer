#!/bin/bash

# print outputs and exit on first failure/show output of commands
set -xe

if [ $TRAVIS_BRANCH == "master" ] ; then
    print "in heeeere!!!"
    cd build
    # Initialize a new git repo in _site, and push it to our server.
    git init
    # setup ssh agent, git config and remote
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/travis_rsa
    git remote add deploy "travis@datasfexplorer.tk:/var/www/open-data-explorer/public_html"
    git config user.name "Travis CI"
    git config user.email "travis@datasfexplorer.tk"

 # commit compressed files and push it to remote
    git add .
    git status # debug
    git commit -m "Deploy compressed files"
    git push --force deploy master

else

    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi
