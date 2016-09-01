#setup_ssh_agent
#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/deploy_rsa
