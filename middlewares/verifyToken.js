const jwt = require('jsonwebtoken');


function verifyJWT(req, res, next) {
    const token = req.headers.token
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ message: "Invalid token " });
        }
    } else {
        res.status(400).json({message:'no token provded'})
    }
}


function verifyTokenAndAuthorization(req, res, next) {
       verifyJWT(req, res, ()=>{
        if (req.user.id === parseInt(req.params.id) || req.user.isAdmin) {
          next();
        } else {
            return res.status(403).json({
              message: "You are not allowed",
            });
        }
       })
}

function verifyTokenAndAdmin(req, res, next) {
    verifyJWT(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        } else {
            return res.status(403).json({
              message: "You are not allowed",
            });
        }
    })
}

module.exports = { verifyJWT ,verifyTokenAndAuthorization,verifyTokenAndAdmin };