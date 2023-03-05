const User = require("../models/user")

const { AUTH_TOKEN_MISSING_ERR, AUTH_HEADER_MISSING_ERR, JWT_DECODE_ERR, USER_NOT_FOUND_ERR } = require("../error")
const { verifyJwtToken } = require("../utils/token")



exports.checkAuthentication = async (req, res, next) => {
    try {
        // check for auth header from client 
        const header = req.headers.authorization

        if (!header) {
            next({ status: 403, message: AUTH_HEADER_MISSING_ERR })
            return
        }

        // verify  auth token
        const token = header.split("Bearer ")[1]

        if (!token) {
            next({ status: 403, message: AUTH_TOKEN_MISSING_ERR })
            return
        }

        const payload = verifyJwtToken(token,next)

        if (!payload.userId) {
            next({ status: 403, message: JWT_DECODE_ERR })
            return
        }

        const user = await User.findById(payload.userId).exec()

        if (!user) {
            next({status: 404, message: USER_NOT_FOUND_ERR })
            return
        }

        req.user = user;
        res.locals.user = user

        next()
    } catch (err) {
        next(err)
    }
}
