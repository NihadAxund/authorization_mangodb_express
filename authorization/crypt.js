import { config } from "dotenv"
import jwt from "jsonwebtoken"

config()
const SECRET = process.env.TOKEN_SECRET
const PASSWD_SECRET = process.env.PASSWORD_SECRET

export function createToken(user){
    return jwt.sign(user, SECRET, {expiresIn: "10h", algorithm: "HS512"})
}

export function hashPassword(password){
    return jwt.sign(password, PASSWD_SECRET)
}

export function verifyPassword(hashedpassword, password){
    return jwt.verify(hashedpassword, PASSWD_SECRET, (err, paswd) => {
        if(password != paswd){
            throw Error("Password didnt match")
        }else {
            return null
        }
      })
}