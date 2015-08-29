# cbs_community
Website for Chand Bagh School community

# How to setup development evironment 
1. Install node on your system

2. Use npm to install bower, couchapp (Note: use sudo before each command if you are linux user)
  - npm install bower -g
  - npm install couchapp -g
  
3. Go to project home directory and install dependencies listed in package.json and bower.json
  - npm install
  - bower install
  
4. Install and run couchdb
5. Create database "members"
6. Run the following command from project home directory
   - couchapp push  databases/members.js http://127.0.0.1:5984/members
7.Start Apllication
   - node app.js
   - (Server will start listening on port 3000 )  
8. Hit http://localhost:3000 in browser
   

