#!/bin/bash

# print outputs and exit on first failure/show output of commands
set -xe
echo $TRAVIS_BRANCH
if [ $TRAVIS_BRANCH == "master" ] ; then
    echo "*******pushing build to production website!********"
    # setup ssh agent, git config and remote
    cd build
    # Initialize a new git repo in _site, and push it to our server.
    git init
    git remote add deploy "deploy@datasfexplorer.tk:/var/www/open-data-explorer/"
    git config user.name "Travis CI"
    git config user.email "travis@datasfexplorer.tk"
    #git config --global push.default simple

 # commit compressed files and push it to remote
    git add .
    git commit -m "Deploy compressed files"
    git push --force deploy master
    echo "****SUCCESS: Production build was deployed ********"
elif [ $TRAVIS_BRANCH == "develop" ] ; then
    echo "******pushing build to staging website!*******"
    # setup ssh agent, git config and remote
    echo "$DEPLOY_KEY" > deploy_key.pem
    echo "$DEPLOY_KEY"
    eval $(ssh-agent)  # Start the ssh agent
    chmod 600 deploy_key.pem # This key should have push access
    ssh-add deploy_key.pem
    cd build
    # Initialize a new git repo in _site, angd push it to our server.
    git init
    git remote add deploy "deploy@datasfexplorer.tk:/var/www/open-data-explorer/"
    git config user.name "Travis CI"
    git config user.email "travis@datasfexplorer.tk"
 # commit compressed files and push it to remote
    git add .
    git commit -m "Deploy compressed files"
    git push --force deploy master
    echo "****SUCCESS: Staging build was deployed ********"
else
    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi
