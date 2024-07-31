const express = require('express');
const userService = require('../services/userService')
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Ruta para el panel de usuario
router.get('/user-panel', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    try {
        // Obtener el usuario actual desde el middleware o la base de datos
        const user = await userService.getUserBy_Id(req.user.id);
        console.log("buscando usuario despues de validar token (protec-routes): ", req.user.id);
        
        console.log("datos view: ", user)
        res.render('user-panel', {
            user: user
        });

    } catch (error) {
        console.error('Error rendering user panel:', error.message);
        res.status(500).send('Error rendering user panel');
    }
});
// app.get('/user-panel', (req, res) => {
//     // Ejemplo de datos que puedes pasar a tu vista
//     res.render('user-panel', { 
//         borrowedBooks: [
//             { title: 'Book 1', author: 'Author 1' },
//             { title: 'Book 2', author: 'Author 2' }
//         ],
//         user: { name: 'John Doe' }
//     });
// });

// Ruta para el panel de administrador
router.get('/admin-panel', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.send('Welcome to Admin Panel');
});

module.exports = router;