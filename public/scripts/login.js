import { loginUser, registerUser } from './apiServices.js';
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    try {
        const result = await registerUser(userData);
        alert('Usuario registrado exitosamente');
        form.reset();
    } catch (error) {
        alert('Error al registrar el usuario');
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    try {
        const result = await loginUser(userData);
        alert('Inicio de sesión exitoso');
        window.location.href = 'user-panel.html'; // Redirige a la página de user-panel
    } catch (error) {
        alert('Error al iniciar sesión');
    }
});