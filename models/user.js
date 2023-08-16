/** User class for message.ly */
const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require('bcrypt')

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPw = await bcrypt.hash(password, 12);
    const result = await db.query(`
    INSERT INTO users (
      username,
      password,
      first_name,
      last_name,
      phone,
      join_at,
      last_login_at
      )
    VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
    RETURNING username, password, first_name, last_name, phone
    `, [username, hashedPw, first_name, last_name, phone]);

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
    if (result.rows.length == 0) {
      return false;
    }
    const user = result.rows[0];
    return bcrypt.compare(password, user.password);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(`UPDATE users SET last_login_at = current_timestamp WHERE username = $1`, [username])
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(`SELECT username, first_name, last_name, phone FROM users`)
    return result.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(`SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = $1`, [username])
    if (result.rows.length == 0) {
      throw new ExpressError('User not found', 404);
    }

    return result.rows[0]

  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(`
    SELECT
      msg.id,
      msg.to_username,
      usr.first_name,
      usr.last_name,
      usr.phone,
      msg.body,
      msg.sent_at,
      msg.read_at
    FROM messages AS msg
    JOIN users AS usr ON msg.to_username = usr.username
    WHERE msg.from_username = $1
    `, [username])

    return result.rows.map(msg => ({
      id: msg.id,
      to_user: {
        username: msg.to_username,
        first_name: msg.first_name,
        last_name: msg.last_name,
        phone: msg.phone
      },
      body: msg.body,
      sent_at: msg.sent_at,
      read_at: msg.read_at
    }))
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(`
    SELECT
      msg.id,
      msg.from_username,
      usr.first_name,
      usr.last_name,
      usr.phone,
      msg.body,
      msg.sent_at,
      msg.read_at
    FROM messages AS msg
    JOIN users AS usr ON msg.from_username = usr.username
    WHERE msg.to_username = $1
    `, [username])

    return result.rows.map(msg => ({
      id: msg.id,
      from_user: {
        username: msg.from_username,
        first_name: msg.first_name,
        last_name: msg.last_name,
        phone: msg.phone
      },
      body: msg.body,
      sent_at: msg.sent_at,
      read_at: msg.read_at
    }))
  }
}


module.exports = User;