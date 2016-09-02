#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

echo "Setting up ssh!"

#touch ~/.ssh/known_hosts
#chmod 777 ~/.ssh/known_hosts
#touch ~/.ssh/config

#echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host datasfexplorer.tk\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host datasf-explorer.tk\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
#echo -e "Host 162.243.143.214\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# Import the SSH deployment key


openssl aes-256-cbc -K $encrypted_5c93ddfc62aa_key -iv $encrypted_5c93ddfc62aa_iv -in .travis/travis_deploy.enc -out travis_deploy -d
rm travis_deploy.enc # Don't need it anymore
chmod 600 travis_deploy
mv travis_deploy ~/.ssh/id_rsa
