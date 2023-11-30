import { config } from "dotenv"
import jwt from "jsonwebtoken"
config()
const SECRET = process.env.TOKEN_SECRET


export function authMiddleware(req, res, next){
    const header = req.headers['authorization']
    const token = header && header.split(" ")[1]   // "Bearer kfjkdsfjkdjfkdsjfkdsjfsdfjsdkfjs"
    console.log(req.headers)
    if(token == null) return res.status(401).send("No Token")
    jwt.verify(token, SECRET, (err, user) => {
    
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
      })
}