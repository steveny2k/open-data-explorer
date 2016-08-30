
#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

echo "Setting up ssh keys!"

# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_5c93ddfc62aa_key -iv $encrypted_5c93ddfc62aa_iv -in .travis/travis_rsa.enc -out ~/.ssh/travis_rsa -d
chmod 600 ~/.ssh/travis_rsa
