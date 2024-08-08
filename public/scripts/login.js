import { loginUser, registerUser } from './apiServices.js';

//functions
function showMessage(type, message) {
    const messageElement = document.getElementById(`${type}-message`);
    const messageDiv = messageElement.querySelector('.alert-message'); // Selecciona el div con clase alert-message

    if (!messageElement || !messageDiv) {
        console.error(`Element not found for type: ${type}`);
        return;
    }

    messageDiv.textContent = message;

    // Asegúrate de que el mensaje está visible
    messageElement.style.display = 'flex';
    messageElement.classList.remove('fade', 'show');
    // Forzar reflujo para reiniciar la animación
    void messageElement.offsetWidth;
    messageElement.classList.add('fade', 'show');

    // Ocultar el mensaje después de 5 segundos, si no se ha cerrado manualmente
    const timeoutId = setTimeout(() => {
        hideMessage(`${type}-message`);
    }, 5000);

    // Añadir un listener para el botón de cerrar que detiene el temporizador
    const closeButton = messageElement.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(timeoutId);
        hideMessage(`${type}-message`);
    });
}

// Función para ocultar el mensaje
function hideMessage(id) {
    const messageElement = document.getElementById(id);
    if (messageElement) {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 150); // Tiempo de espera para la animación de desvanecimiento
    }
}
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
                showMessage('success', 'inicio de sesión exitoso');

            } catch (error) {
                showMessage('error', `${error.message}`);
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
            showMessage('success', 'Registro de usuario exitoso');
            form.reset();
        } catch (error) {
            const errors = JSON.parse(error.message);
            console.log(errors)
            errors.forEach(err => {
                showMessage('error', err.message);
            });
        }
    });
});
