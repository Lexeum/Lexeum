const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// Ruta para el dashboard
router.get('/', isAuthenticated, (req, res) => {
    // Renderiza el dashboard solo si está autenticado
    res.render('dashboard', { user: req.session.user });
});

module.exports = router;