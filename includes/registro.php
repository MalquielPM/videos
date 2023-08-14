<?php
require 'conexion.php';

if(isset($_POST['registro'])) {

$usuario = $_POST['nombre_user'];
$contrasena = $_POST['contrasena_user'];
$correo = $_POST['correo_user'];

$sql = "INSERT INTO usuarios (id_user, nombre_user, contrasena_user, correo_user) VALUES (null, '$usuario', '$contrasena', '$correo')";
$resultado = mysqli_query($conexion,$sql);
	if($resultado) {
		echo "¡Se insertaron los datos correctamente!";
	} else {
		echo "¡No se puede insertar la informacion!"."<br>";
		echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
	}
}
?>
