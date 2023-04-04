const { response } = require("express")
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isObjectIdOrHexString } = require("mongoose");
const { translateAliases } = require("../models/User");

//For SignUp  
const signupController = async(req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
           return res.status(400).send("All fields are required");
        }

        const oldUser = await User.findOne({email});

        if(oldUser) {
            return res.status(409).send("User is already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        return res.json({
            user,
        });


    } catch (error) {
        console.log(error);
    }
}

//For LogIn
const loginController = async(req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
           return res.status(400).send("All fields are required");
        }  

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).send("User is not registered");
        }

        const matched = await bcrypt.compare(password, user.password);

        if(!matched) {
            return res.status(403).send("Incorrect Password");
        }

        const accessToken = await generateAccessToken(user);

        return res.json({
            accessToken,
        });

    } catch (error)  {}
    };

//exporting both of the controllers in the body
// internal function 

const generateAccessToken = (data) => {
   const token = jwt.sign(data, "aj48cnr0sj3nd9ty");
   console.log(token);
};

module.exports = {
    signupController,
    loginController
}