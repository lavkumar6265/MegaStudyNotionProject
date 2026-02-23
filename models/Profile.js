const mongoose = require('mongoose');

// Here you are creating a Schema.
// A Schema tells MongoDB what fields your document will have and what type of data will be stored.

const profileSchema = new mongoose.Schema({
    gender: {
        type:String,
    },
    dateOfBirth: {
        type:String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type:Number,
        trim:true,
    }
});

// ✔ Creates a Model named "Profile" using the schema.

module.exports = mongoose.model("Profile",profileSchema);


// 🙂🙂🙂✔ Creates a Model named "Profile" using the schema.
// ✔ A Model is what you actually use to:
// create data
// find data
// update data
// delete data

// 🙂🙂🙂in index.js file are any other file that file want to use this schema use below line of code
// const Profile = require("./Profile");
// Profile.create({ gender: "male", about: "Hello" });
