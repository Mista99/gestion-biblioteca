import { loginUser, registerUser } from './apiServices.js';

document.addEventListener('DOMContentLoaded', function() {
    const login = document.getElementById('loginForm');

    if (login) {
        login.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());

            try {
                const result = await loginUser(userData);
                alert('Inicio de sesión exitoso'); // Redirige a la página de user-panel
            } catch (error) {
                alert('Error al iniciar sesión');
            }
        });
    } else {
        console.error('Elemento loginForm no encontrado en el DOM');
    }

    const register = document.getElementById('registerForm');
    register.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries());

        try {
            const result = await registerUser(userData);
            console.log("la data capturada es:", userData)
            alert('Usuario registrado exitosamente');
            form.reset();
        } catch (error) {
            alert('Error al registrar el usuario');
        }
    });
});
