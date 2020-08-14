// redirect to login page if user is not logged in
const redirectLogin = (req, res, next) => {
    if (!req.signedCookies.session) {
        return res.redirect('/users/login');
    }

    next();
}

module.exports = redirectLogin;