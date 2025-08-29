Requerimientos
Gestión de usuarios

El sistema debe permitir registrar usuarios con datos básicos (cédula, nombre, correo, contraseña, rol).

Los usuarios deben poder iniciar y cerrar sesión.

Debe haber dos tipos de usuarios: admin (gestiona) y usuario (consulta, préstamo).

Gestión de libros

El administrador debe poder registrar, editar, eliminar y consultar libros.

Cada libro debe tener: título, autor, editorial, año, ISBN, categoría, y número de copias.

Gestión de préstamos y devoluciones

Los usuarios pueden solicitar un préstamo si hay copias disponibles.

El sistema debe registrar la fecha de préstamo y de devolución.

El sistema debe permitir extender el préstamo, máximo dos veces.

Al devolver el libro, la copia debe pasar a estar disponible nuevamente.

Panel de usuario

Cada usuario debe ver sus libros prestados y el historial de préstamos.

Debe mostrar fechas y si tiene préstamos atrasados.

Panel de administrador

El admin debe ver el listado de usuarios, libros y préstamos.

Puede modificar roles y gestionar la disponibilidad de libros.

Seguridad y autenticación

El sistema debe manejar tokens (JWT) en cookies para autenticar usuarios.

Las contraseñas deben almacenarse encriptadas.
