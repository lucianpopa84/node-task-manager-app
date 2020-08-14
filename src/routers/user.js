const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth'); // authentication
const multer = require('multer'); // file upload
const sharp = require('sharp'); // image resize
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account'); // send email automatically

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        // res.status(201).send({ user, token });
        res.cookie('session', { user, token }, { maxAge: 7200000, signed: true }).redirect('/tasks?limit=10');
    } catch(error) {
        // res.status(400).send(error);
        res.redirect('/users/signup/400');
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('session', { user, token }, { maxAge: 7200000, signed: true });
        res.redirect('/tasks?limit=4');
    } catch {
        // res.status(400).send();
        res.redirect('/users/login/400');
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token); // remove login token
        await req.user.save();
        res.clearCookie('session').redirect('/users/login');
        // res.send()
    } catch {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []; // empty tokens array
        await req.user.save();
        res.send();
    } catch {
        res.status(500).send();
    }
});

// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {

//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);

//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     } catch (error) {
//         res.status(500).send();
//     }
// });

// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'email', 'password', 'age'];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid update key(s)'});
//     }
    
//     try {
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         const user = await User.findById(req.params.id);
//         updates.forEach((update) => user[update] = req.body[update]);
//         await user.save();

//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update key(s)'});
    }
    
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if (!user) {
        //     return res.status(404).send();
        // }

        await req.user.remove(); // same as commented code (refactored code)
        sendCancelationEmail(req.user.email, req.user.name);

        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// upload avatar files
const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image file'))
        }

        cb(undefined, true); // (callback(error, success))
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = router;