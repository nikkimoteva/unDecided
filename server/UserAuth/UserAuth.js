require("../database/Database");
const bcrypt = require('bcrypt');
const UserModel = require('../database/models/User');
const CryptoJS = require("crypto-js");
const saltRounds = 10;
const cryptoSalt = "qe#7$$9djn";

function addUser(name, email, password) {
    return UserModel.findOne({email: email})
    .then ( (res) => {
        if (res){
            console.log("Email already exists");
            return false;
        } else {
            return bcrypt.hash(password, saltRounds)
                .then((hash, err) => {
                if (err) {
                    console.log(err);
                    console.log("Internal Error");
                    return null;
                } else {
                    const hashGen = hash;
                    UserModel.create({name: name, email: email, passwordHash: hashGen});
                    console.log("SUCCESSFULLY ADDED USER");
                    return true;
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
            return null;
        }
        return bcrypt.compare(password, user.passwordHash)
        .then ((match) => {
            if (match) {
                return user;
            } else {
                return null;
            }
        })
        .catch( (err) => {
            console.log(err);
        });
    });
}


function addAWSCred(email, accessKey, secretKey) {
    if (accessKey.trim() === "" || secretKey.trim() === "") return false;
    const crypt = CryptoJS.AES.encrypt(secretKey, cryptoSalt).toString();
    return UserModel.findOneAndUpdate({email: email}, {AWSAccessKey: accessKey, AWSSecretKey: crypt})
    .then ((res, err) => {
        if (err) {
            console.log(err);
            return null;
        } else {
            return true;
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
        const bytes = CryptoJS.AES.decrypt(user.AWSSecretKey, cryptoSalt);
        const originalSecret = bytes.toString(CryptoJS.enc.Utf8);
        return {access: user.AWSAccessKey, secret: originalSecret};
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
}

module.exports = {
    addUser: addUser,
    validatePassword: validatePassword,
    addAWSCred: addAWSCred,
    getAWSCred: getAWSCred,
};
