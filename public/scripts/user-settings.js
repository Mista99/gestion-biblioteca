import { putUserName, putUserEmail, putUserPassword, deleteUser } from './apiServices.js';
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
const updateUserNameForm = document.getElementById('updateUserNameForm'); // Selecciona el formulario de "Cambiar Nombre"

updateUserNameForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío normal del formulario

    const newUserName = document.getElementById('newUserName').value; // Captura el nuevo nombre

    if (newUserName) {
        const userNameData = { name: newUserName };
        try {
            // Aquí llamamos a la función de la API que actualizará el nombre
            const response = await putUserName(userNameData);
            console.log('Nombre actualizado:', response);
        } catch (error) {
            console.error('Error al actualizar el nombre:', error);
        }
    }
});
const updateUserEmailForm = document.getElementById('updateUserEmailForm'); 

if (updateUserEmailForm) {
    console.log("Formulario de actualización de correo encontrado");

    updateUserEmailForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío normal del formulario
        console.log("Evento submit detectado");

        const newEmail = document.getElementById('newEmail').value; // Captura el nuevo correo electrónico
        console.log("Nuevo correo:", newEmail);

        if (newEmail) {
            const userEmailData = { email: newEmail };
            try {
                console.log("Llamando a la función putUserEmail con:", userEmailData);
                const response = await putUserEmail(userEmailData);
                console.log('Correo actualizado:', response);
            } catch (error) {
                console.error('Error al actualizar el correo:', error);
            }
        }
    });
} else {
    console.error("Formulario de actualización de correo NO encontrado");
}

const updatePasswordForm = document.getElementById('updatePasswordForm'); // Selecciona el formulario de "Cambiar Contraseña"

updatePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío normal del formulario
    console.log("ingresnadod al evento")
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
            console.log("llamando a la API")
            const response = await putUserPassword(passwordData);
            console.log('Contraseña actualizadaaaaaaaaaaa:', response);
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