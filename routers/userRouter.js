import express from "express"
import { User } from "../entities/user.entity.js"
import { createToken, hashPassword, verifyPassword } from "../authorization/crypt.js"
import { authMiddleware } from "../authorization/middleware.js"
export const user = express.Router()


user.post("/signup", async (req, res)=> {
   try {
    const user = new User(req.body)
    user.password = hashPassword(req.body.password)
    const saved = await user.save()
    return res.status(200).json(saved)
    
   } catch (error) {
    return res.status(200).json(error)
   }
})
// find []
// findOne{}
user.post("/login", async (req, res)=> {
    const {password, username} = req.body
    const user = await User.findOne({username})
    if(user == null){
        res.status(404).send("Can not find user")
    }
    try {
        verifyPassword(user.password, password)
        const token = createToken({id: user._id, username: user.username, email: user.email})
        return res.status(200).json({token})
    } catch (error) {
        return res.status(400).json({message: "error"})
    }

})

// authMiddleware

user.get("/me",authMiddleware, async (req, res)=> {
    const user = await User.find({_id: req.user.id})
    res.send(user)
})