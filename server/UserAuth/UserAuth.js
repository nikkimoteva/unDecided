require("../database/Database");
const bcrypt = require('bcrypt');
const UserModel = require('../database/models/User');
const saltRounds = 10;

function addUser(name, email, password) {
    return UserModel.findOne({email: email})
    .then ( (res) => {
        if (res){
            console.log("Email already exists");
            return 1;
        } else {
            return bcrypt.hash(password, saltRounds)
                .then((hash, err) => {
                if (err) {
                    console.log(err);
                    // send internal error message 
                    console.log("Internal Error");
                    return null;
                } else {
                    const hashGen = hash;
                    // store hashed password and salt in DB
                    UserModel.create({name: name, email: email, passwordHash: hashGen});
                    console.log("SUCCESSFULLY ADDED USER");
                    // redirect to login page
                    return 2;
                }
            });
        }
    });
}

function validatePassword(email, password) {
    return UserModel.findOne({email: email}).exec()
    .then ( (user) => {
        if (!user) {
            console.log("user not found");
            // user not found, send "email or password is incorrect"
            return null;
        }
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


function addAWSCred(email, accessKey, secretKey) {
    if (accessKey.trim() === "" || secretKey.trim() === "") return 1;
    return bcrypt.hash(secretKey, saltRounds)
    .then((hash, err) => {
        if (err) {
            console.log(err);
            return null;
        } else {
            return UserModel.findOneAndUpdate({email: email}, {AWSAccessKey: accessKey, AWSSecretKey: hash})
            .then ((res, err) => {
                if (err) {
                    console.log(err);
                    return null;
                } else {
                    return 2;
                }
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function getAWSCred(email) {
    return UserModel.findOne({email: email})
    .then((user) => {
        if (!user.AWSSecretKey || !user.AWSAccessKey) return null;
        return {access: user.AWSAccessKey, secret: user.AWSSecretKey};
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = {
    addUser: addUser,
    validatePassword: validatePassword,
    addAWSCred: addAWSCred,
    getAWSCred: getAWSCred,
};
