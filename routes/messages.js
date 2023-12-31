const express = require("express");
const Message = require("../models/message");
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config.js");
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const result = await Message.get(req.params.id)
        return res.json({ message: result })
    }
    catch (e) {
        next(e);
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const result = await Message.create(req.user, req.body.to_username, req.body.body)
        return res.json({ message: result })
    }
    catch (e) {
        next(e);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async function (req, res, next) {
    try {
        const result = await Message.markRead(req.params.id)
        return res.json({ message: result })
    }
    catch (e) {
        next(e);
    }
})

module.exports = router;

