#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

echo "Setting up ssh keys!"

#touch ~/.ssh/known_hosts
#chmod 777 ~/.ssh/known_hosts
#touch ~/.ssh/config

#echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host datasfexplorer.tk\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host datasf-explorer.tk\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host 162.243.143.214\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# Import the SSH deployment key
#openssl aes-256-cbc -K $encrypted_5c93ddfc62aa_key -iv $encrypted_5c93ddfc62aa_iv -in .travis/travis_rsa.enc -out ~/.ssh/travis_rsa -d
mv deploy_rsa ~/.ssh/
chmod 600 ~/.ssh/travis_rsa
