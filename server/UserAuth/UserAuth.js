require("../database/Database");
const bcrypt = require('bcrypt');
const UserModel = require('../database/models/User');
const saltRounds = 10;

function addUser(name, username, password) {
    let saltGen;
    return UserModel.findOne({userName: username}, function(err, res) {
        if (res){
            console.log("Email already exists");
            return;
        } else {
            return bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) {
                    console.log(err);
                    // send internal error message
                    console.log("Internal Error");
                }
                saltGen = salt;
                return bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                        // send internal error message 
                        console.log("Internal Error");
                        return {};

                    } else {
                        const hashGen = hash;
                        // store hashed password and salt in DB
                        UserModel.create({name: name, userName: username, salt: saltGen, passwordHash: hashGen});
                        console.log("SUCCESSFULLY ADDED USER");
                        // redirect to login page
                        return "SUCCESS!";
                    }
                });
            })
        }
    });
}

function validatePassword(username, password) {
    return UserModel.findOne({userName: username}, function(err, user) {
        console.log(user);
        if (!user) {
            console.log("user not found");
            // alert("Username or password is incorrect. Please try again.");
            return null;
        }
        if (err) {
            console.log(err);
            // username not found, send "username or password is incorrect"
            // alert("Username or password is incorrect. Please try again.");
            return null;
        }
        const usr = user;
        // const saltGen = user.salt;
        // const passHash = saltGen + password; no need to store salt?? look more into it
        return bcrypt.compare(password, user.passwordHash, function(err, match) {
            if (match) {
                //login successful
                return usr;
            } else {
                console.log(err);
                // password incorrect, send "username or password is incorrect"
                return false;
            }
        });
    });
}

module.exports = {
    addUser: addUser,
    validatePassword: validatePassword
};
