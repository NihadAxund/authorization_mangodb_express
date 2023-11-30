

export function checkAuthHeader(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).json({message: "Auth token not found"})
    }else {
        next()
    }
}


export function testMiddle(req, res, next){
    console.log("Passed")
    next()
}