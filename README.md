# cbs_community
Website for Chand Bagh School community


we are using connect-multiparty as file upload middleware instead of multer since connect-multiparty supports ng-file-upload module but multer does not.


# How to setup development local environment
1. Install node on your system
2. Use npm to install bower, couchapp (Note: use sudo before each command if you are linux user)
  - npm install bower -g
  - npm install couchapp -g
3. Go to project home directory and install dependencies listed in package.json and bower.json
  - npm install
  - sudo bower install --allow-root  (if plain **bower install** does not work)
4. Install and run couchdb
5. Create databases "members" and "events"
6. Run the following command from project home directory
   i. node_modules/.bin/couchapp push databases/members.js http://127.0.0.1:5984/members (Linux/Mac)
   ii. node_modules/.bin/couchapp push databases/events.js http://127.0.0.1:5984/events (Linux/Mac)
   - use backslashes in path to couchapp in the commands (in this point) like node_modules\.bin\couchapp if you are setting the app up on Windows environment.
7. Start Apllication
   - node app.js
   - (Server will start listening on port 3001 )  
   node_modules\.bin\webpack -d
8. Hit http://localhost:3001 in browser
9. you can also use "nodemon"
    -to run application using nodemon
    -nodemon app