// redirect to home page if user is already logged in
const redirectHome = (req, res, next) => {
    if (req.signedCookies.session) {
        return res.redirect('/tasks?limit=10');
    }
    next();
}

module.exports = redirectHome;