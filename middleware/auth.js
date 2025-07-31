function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // Si no está autenticado, redirige a login
    res.redirect('/login');
}

module.exports = isAuthenticated;
