#scripts to set up the server

#update the system
sudo apt-get update
yes "y" | sudo apt-get install build-essential

####create swappable memory to the server to act like more ram###
cd ~
sudo fallocate -l 2G /swapfile
#checks to make sure its there
ls -lh /swapfile

#set perms
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
#check to make sure its working
sudo swapon -s
#enable swap each time we boot up our server
fnLine="\n /swapfile none swap sw 0 0"
echo $fnLine >> /etc/fstab

####install node v.6.+ ####
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs


#####install git + nginx######
yes "y" | sudo apt-get install git
yes "y" | sudo apt-get install nginx

#configure nginx
cd /var/wwww
#get the github repo
git clone https://github.com/DataSF/open-data-explorer.git

cd /var/www/open-data-explorer
sudo npm install
chown -R www-data:www-data /var/www/
#change the directory perms to use www-data
sudo npm run build



