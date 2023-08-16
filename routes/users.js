const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config.js");
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const result = await User.all()
        return res.json({ users: result })
    }
    catch (e) {
        next(e);
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await User.get(req.params.username)
        return res.json({ user: result })
    }
    catch (e) {
        next(e);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await User.messagesTo(req.params.username)
        return res.json({ messages: result })
    }
    catch (e) {
        next(e);
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await User.messagesFrom(req.params.username)
        return res.json({ messages: result })
    }
    catch (e) {
        next(e);
    }
})



module.exports = router;
