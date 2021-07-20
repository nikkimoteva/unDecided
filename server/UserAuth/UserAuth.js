const bcrypt = require('bcrypt');
const UserModel = require('../database/models/User');
const saltRounds = 10;

export function addPassword(name, username, password) {
    let saltGen;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(err);
            // send internal error message
            return false;
        }
        saltGen = salt;
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                console.log(err);
                // send internal error message
                return false;
            } else {
                const hashGen = hash;
                // store hashed password and salt in DB
                UserModel.insertOne({name: name, userName: username, salt: saltGen, passwordHash: hashGen});
                // redirect to login page
                return true;

            }

        });
    });
}

export function validatePassword(username, password) {
    UserModel.find({username}, function(err, user) {
        if (err) {
            console.log(err);
            // username not found, send "username or password is incorrect"
            return false;
        }
        const saltGen = user.salt;
        const passHash = password + saltGen;
        bcrypt.compare(passHash, user.passwordHash, function(err, match) {
            if (match) {
                //login successful
                return true;
            } else {
                console.log(err);
                // password incorrect, send "username or password is incorrect"
                return false;
            }
        });
    });
}
