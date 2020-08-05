const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
       type: String,
       required: true,
       trim: true,
       minlength: [6, 'Password must be greater than 6 characters'],
       validate(value) {
           if (validator.contains(value.toLowerCase(), 'password')) {
            throw new Error('Password must not contain "password"');
           }
       } 
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// setup user relation with tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: "owner"
});

// define generateAuthToken method on user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1 day'});

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// override toJSON method (remove password and tokens array from response)
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// define findByCredentials method on User model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}

// hash (encode) the plain text password with bcrypt before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// delete user tasks when user is removed from database
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id});

    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;