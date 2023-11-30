import express from 'express'

import { createConnection } from "../connection.js"

const mongoose = await createConnection()

const BlogScheme = mongoose.Schema({
    userID: {type: mongoose.Types.ObjectId,ref:"User"},
    title:{
        type:String,
        minLength: 5,
        maxLength: 150,
        required:[true,"Title"]
    },
    text:{
        type:String,
        minLength: 5,
        maxLength: 250,
        required:[true,"Text"]
    }
    
},{
    timestamps:true
})

export const Blog = mongoose.model("Blog",BlogScheme)