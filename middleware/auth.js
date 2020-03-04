const jwt = require('jsonwebtoken');

const noAuth = (req, next) => {
    req.isAuth = false;
    return next();
}

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader)
        return noAuth(req, next);

    const token = authHeader.split(' ')[1];
    if (!token)
        return noAuth(req, next);

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    } catch(err) {
        return noAuth(req, next);
    }

    if (!decodedToken)
        return noAuth(req, next);

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}