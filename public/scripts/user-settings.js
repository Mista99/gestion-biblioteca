import { updateUserEmail, updateUserName, updatePassword, deleteUser } from './apiServices.js';
async function getUserName() {
    const url = '/api/username'; // La URL correcta para obtener el nombre del usuario

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // No es necesario agregar el token manualmente si usas credentials: 'include'
            },
            credentials: 'include', // Incluir cookies en la solicitud
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Nombre del usuario:', data.name); // Mostrar el nombre en la consola

        // Actualizar el valor del input con id "newUserName" con el nombre obtenido
        document.getElementById('userName').value = data.name;

        return data; // Retornar los datos, si es necesario

    } catch (error) {
        console.error('Hubo un error:', error.message);
    }
}


// Función para obtener el correo electrónico del usuario
async function getUserEmail() {
    const url = '/api/useremail'; // La URL correcta para obtener el correo electrónico del usuario

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // No es necesario agregar el token manualmente si usas credentials: 'include'
            },
            credentials: 'include', // Incluir cookies en la solicitud
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Correo electrónico del usuario:', data.email); // Mostrar el correo en la consola

        // Actualizar el valor del input con id "newEmail" con el correo electrónico obtenido
        document.getElementById('currentEmail').value = data.email;

        return data; // Retornar los datos, si es necesario

    } catch (error) {
        console.error('Hubo un error:', error.message);
    }
}
const updateUserNameForm = document.querySelector('form'); // Selecciona el formulario de "Cambiar Nombre"

updateUserNameForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío normal del formulario

    const newUserName = document.getElementById('newUserName').value; // Captura el nuevo nombre

    if (newUserName) {
        const userNameData = { name: newUserName };
        try {
            // Aquí llamamos a la función de la API que actualizará el nombre
            const response = await updateUserName(userNameData);
            console.log('Nombre actualizado:', response);
        } catch (error) {
            console.error('Error al actualizar el nombre:', error);
        }
    }
});
const updateUserEmailForm = document.querySelector('form'); // Selecciona el formulario de "Cambiar Correo Electrónico"

updateUserEmailForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío normal del formulario

    const newEmail = document.getElementById('newEmail').value; // Captura el nuevo correo electrónico

    if (newEmail) {
        const userEmailData = { email: newEmail };
        try {
            // Aquí llamamos a la función de la API que actualizará el correo
            const response = await updateUserEmail(userEmailData);
            console.log('Correo actualizado:', response);
        } catch (error) {
            console.error('Error al actualizar el correo:', error);
        }
    }
});
const updatePasswordForm = document.querySelector('form'); // Selecciona el formulario de "Cambiar Contraseña"

updatePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío normal del formulario

    const currentPassword = document.getElementById('currentPassword').value; // Captura la contraseña actual
    const newPassword = document.getElementById('newPassword').value; // Captura la nueva contraseña
    const confirmPassword = document.getElementById('confirmPassword').value; // Captura la confirmación de la nueva contraseña

    if (newPassword !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
    }

    if (newPassword && currentPassword) {
        const passwordData = { currentPassword, newPassword };
        try {
            // Aquí llamamos a la función de la API que actualizará la contraseña
            const response = await updatePassword(passwordData);
            console.log('Contraseña actualizada:', response);
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
        }
    }
});

// Llamar a las funciones para obtener los datos del usuario cuando la página se carga
window.onload = () => {
    getUserName();
    getUserEmail();
};