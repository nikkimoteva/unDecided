require("../database/Database");
const bcrypt = require('bcrypt');
const UserModel = require('../database/models/User');
const saltRounds = 10;

function addUser(name, email, password) {
    let saltGen;
    return UserModel.findOne({email: email})
    .then ( (res) => {
        if (res){
            console.log("Email already exists");
            return 1;
        } else {
            return bcrypt.genSalt(saltRounds)
            .then ((salt, err) => {
                if (err) {
                    console.log(err);
                    // send internal error message
                    console.log("Internal Error");
                    return null;
                }
                saltGen = salt;
                return bcrypt.hash(password, salt)
                    .then((hash, err) => {
                    if (err) {
                        console.log(err);
                        // send internal error message 
                        console.log("Internal Error");
                        return null;

                    } else {
                        const hashGen = hash;
                        // store hashed password and salt in DB
                        UserModel.create({name: name, email: email, salt: saltGen, passwordHash: hashGen});
                        console.log("SUCCESSFULLY ADDED USER");
                        // redirect to login page
                        return 2;
                    }
                });
            });
        }
    });
}

function validatePassword(email, password) {
    return UserModel.findOne({email: email}).exec()
    .then ( (user) => {
        if (!user) {
            console.log("user not found");
            // alert("email or password is incorrect. Please try again.");
            return null;
        }
        // const saltGen = user.salt;
        // const passHash = saltGen + password; no need to store salt?? look more into it
        return bcrypt.compare(password, user.passwordHash)
        .then ( (match) => {
            console.log(match);
            if (match) {
                return user;
            } else {
                // password incorrect, send "email or password is incorrect"
                return null;
            }
        })
        .catch( (err) => {
            console.log(err);
        });
    });
}

module.exports = {
    addUser: addUser,
    validatePassword: validatePassword
};
