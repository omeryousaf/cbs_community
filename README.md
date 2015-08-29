# cbs_community
Website for Chand Bagh School community

# How to setup development evironment 
-Install node on your system

 (Note: use sudo before each command if you are linux user)
-Use npm to install bower, couchapp
   npm install bower -g
   npm install couchapp -g
  
-Go to project home directory and install dependencies listed in package.json and bower.json
   npm install
   bower install
  
-Install and run couchdb
-Create database "members"
-Run the following command from project home directory
   couchapp push  databases/members.js http://127.0.0.1:5984/members
-Start Apllication
   node app.js
   (Server will start listening on port 3000 )  
-Hit http://localhost:3000 in browser
   

