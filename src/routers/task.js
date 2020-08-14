const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {

    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        // res.status(201).send(task);
        res.redirect('/tasks?limit=10');
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try {
        await req.user.populate('tasks').execPopulate({
            path: 'tasks',
            match,
            options: {
                sort,
                limit,
                skip
            }
        });
        
        // res.send(req.user.tasks);  

        const totalTasks = await Task.countDocuments({ owner: req.user._id });

        const pages = Array.from({ length: Math.ceil(totalTasks / limit) },(v, idx) => {
            return {
                num: idx + 1,
                limit,
                skip: (limit * (idx + 1)) - limit
            }
        });
        res.render('tasks', {
            name: 'Lucian Popa',
            tasks: req.user.tasks,
            user: req.user,
            isAuthUser: true,
            enablePaging: totalTasks > limit,
            pages,
            limit
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id); // old method without auth
        const task = await Task.findOne({ _id, owner: req.user._id }); 


        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update key(s)'});
    }
    
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const task = await Task.findById(req.params.id); // old method without auth
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id); // old method without auth
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }
        
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;