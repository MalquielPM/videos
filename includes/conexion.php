 <?php
$servidor = "127.0.0.1";
$usuario = "root"; 
$contraseña = "Svgg1809"; 
$base_de_datos = "videotesis"; 

$conexion = mysqli_connect($servidor, $usuario, $contraseña, $base_de_datos);

if (!$conexion) {
    die("Conexión fallida: " . mysqli_connect_error()); 
}
?>