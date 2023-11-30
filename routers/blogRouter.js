import express from 'express'
import { authMiddleware } from '../authorization/middleware.js'
import { Blog } from '../entities/blog.entity.js'


export const blog = express.Router()


blog.get("/", authMiddleware, async (req, res) => {
    console.log(req.user.id)
    const blogs = await Blog.find({userID: req.user.id})
    return res.status(200).json(blogs)
})

blog.get("/:bid", authMiddleware, async (req, res) => {
    const blogs = await Blog.find({userID: req.user.id, _id: req.params.bid})
    return res.status(200).json(blogs)
})

blog.post("/", authMiddleware, async (req, res) => {
    console.log(req.body)
    const data = req.body
    data.userID = req.user.id
    const blog = await Blog.create(data)
    return res.status(200).json(blog.toJSON())
})

blog.put("/:bid", authMiddleware, async (req, res) => {
    const where = {_id: req.params.bid, userID:req.user.id }
    const blog = await Blog.findOneAndUpdate(where, req.body, {new: true})
    return res.status(200).json(blog.toJSON())
})

blog.delete("/:bid", authMiddleware, async (req, res) => {
    const where = {_id: req.params.bid, userID:req.user.id }
    const blog = await Blog.findOneAndDelete(where)
    return res.status(204).json({message: "Deleted"})
})