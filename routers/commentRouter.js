import express from 'express'
import { authMiddleware } from '../authorization/middleware.js'
import { Comment } from '../entities/comment.entity.js'
import { Rating } from '../entities/rating.entity.js'

export const comment = express.Router()


comment.get("/", authMiddleware, async (req, res) => {
    const comments = await Comment.find({})
    return res.status(200).json(comments)
})

comment.get("/:cid", authMiddleware, async (req, res) => {
    const comments = await Comment.find({_id: req.params.cid}).populate("blogID").exec()
    return res.status(200).json(comments)
})

comment.post("/:bid", authMiddleware, async (req, res) => {
    console.log(req.body)
    const data = req.body
    data.blogID = req.params.bid
    const comment = await Comment.create(data)
    return res.status(200).json(comment.toJSON())
})

comment.put("/:cid", authMiddleware, async (req, res) => {
    const where = {_id: req.params.cid, blogID:req.blog.id }
    const comment = await Comment.findOneAndUpdate(where, req.body, {new: true})
    return res.status(200).json(comment.toJSON())
})

// rating
comment.post("/rate/:cid", authMiddleware, async (req, res) => {
    const {rate} = req.body
    const rating = await Rating.create({commentID: req.params.cid,userID: req.user.id, rate })
    const comment = await Comment.findOne({_id: req.params.cid})
    console.log(comment)
    comment.rating.push(rating._id)
    await comment.save()
    return res.status(200).json(comment.toJSON())
})

////////DEEPCHECK:?PRE()
comment.post("/rate/:cid", authMiddleware, async (req, res) => {
    const { rate } = req.body;
    const existingRating = await Rating.findOne({
        commentID: req.params.cid,
        userID: req.user.id,
    });

    if (existingRating) {
        return res.status(400).json({ error: "You have already rated this comment." });
    }

    const rating = await Rating.create({
        commentID: req.params.cid,
        userID: req.user.id,
        rate,
    });

    const comment = await Comment.findOne({ _id: req.params.cid });
    console.log(comment);

    comment.rating.push(rating._id);
    await comment.save();

    return res.status(200).json(comment.toJSON());
});


comment.post("/rate/calc/:cid", authMiddleware, async (req, res) => {
    // const comment = await Rating.aggregate([{$match: {rate: {$gt: 2, $lt: 7}}},{$group: {_id: null, average: {$avg: '$rate'}}}])
    const comment = await Rating.find({}).
    where('rate').gt(2).lt(7).
    limit(10).
    transform((res) => {
        return res.reduce((a, b) => a + b.rate, 0) / res.length
    }).
    exec()
    return res.status(200).json(comment)
})

comment.get("/rate/:cid", authMiddleware, async (req, res) => {
    const comment = await Comment.findOne({_id: req.params.cid}).populate("rating").exec()
    return res.status(200).json(comment.toJSON())
})



comment.delete("/:cid", authMiddleware, async (req, res) => {
    const where = {_id: req.params.cid, blogID:req.blog.id }
    const comment = await Comment.findOneAndDelete(where)
    return res.status(204).json({message: "Deleted"})
})