const jwt = require("jsonwebtoken")
const jwtmiddleware = (req, res, next) => {
    console.log("inside jwt middleware");
    //logic to verify token
    //get token
    const authheader = req.headers['authorization']
    //check if token exist
    if (!authheader) {
        res.status(401).json("Authorization failed! Token missing")
    }
    const token = authheader.split(" ")[1]
    console.log(token);
    //verify token
    if (!token) {
        res.status(401).json("Authorization failed! Token missing")
    }

    try {
        const jwtresponse = jwt.verify(token, process.env.JWTSECRET)
        console.log(jwtresponse);

        req.payload = jwtresponse

        next()


    } catch (err) {
        console.log(err)
        res.status(401).json("Authorization Failed! Invalid Token!!")
    }

}

 module.exports=jwtmiddleware   


    

