
#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_5c93ddfc62aa_key -iv $encrypted_5c93ddfc62aa_iv -in deploy/travis_rsa.enc -out ~/.ssh/travis_rsa -d
chmod 600 ~/.ssh/travis_rsa
