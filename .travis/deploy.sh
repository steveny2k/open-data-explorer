#!/bin/bash

# print outputs and exit on first failure/show output of commands
set -xe

if [ $TRAVIS_BRANCH == "master" ] ; then
    echo "in heeeere!!!"
    # setup ssh agent, git config and remote
    eval `ssh-agent -s`
    ssh-add ~/.ssh/travis_rsa
    cd build
    # Initialize a new git repo in _site, and push it to our server.
    git init
    git remote add deploy "deploy@datasfexplorer.tk:/var/www/open-data-explorer/"
    git config user.name "Travis CI"
    git config user.email "travis@datasfexplorer.tk"

 # commit compressed files and push it to remote
    git add .
    git commit -m "Deploy compressed files"
    git push --force deploy master

else

    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi