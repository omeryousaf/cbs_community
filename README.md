# cbs_community
Website for Chand Bagh School community


we are using connect-multiparty as file upload middleware instead of multer since connect-multiparty supports ng-file-upload module but multer does not.

to setup application on your local machine 
please pull dev branch
create new db "members"
run 
-> sudo npm install
->sudo bower install --allow-root
->node_modules/.bin/couchapp push databases/members.js http://127.0.0.1:5984/members
to run application
nodemon app
