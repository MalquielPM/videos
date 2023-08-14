<?php 
require 'conexion.php';

if(isset($_POST['login'])) {

$usuario = $_POST['Correo'];
$contrasena = $_POST['Contraseña'];

$sql = "SELECT * FROM Login WHERE Correo = '$usuario' and Contraseña = '$contrasena'";
$resultado = mysqli_query($conexion,$sql);
$numero_registros = mysqli_num_rows($resultado);
	if($numero_registros != 0) {
		echo "Inicio de sesión exitoso. Bienvenido, " . $usuario . "!";
	} else {
		echo "Credenciales inválidas. Por favor, verifica tu nombre de usuario y/o contraseña."."<br>";
		echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
	}
}
?> -->
