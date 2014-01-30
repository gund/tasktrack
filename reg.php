<?php
require_once '/server/User.php';

$error = "";
$ok = 0;

$login = null;
$password = null;
$email = null;

if (isset ( $_POST ['reg'] )) {
	$login = (! empty ( $_POST ['login'] )) ? $_POST ['login'] : null;
	$password = (! empty ( $_POST ['password'] )) ? $_POST ['password'] : null;
	$email = (! empty ( $_POST ['email'] )) ? $_POST ['email'] : null;
	
	if ($login === null || $password === null || $email === null) {
		$error = "Please fill login, password and email field.";
	} else {
		
		try {
			$user = new User ();
			$user->register($login, $password, $email);
			if ($user->getState() == User::U_LOG_IN) {
				$ok = 1;
			} else {
				$error = "Failed to register.";
			}
		} catch ( RuntimeException $e ) {
			switch ($e->getCode ()) {
				case 1062 :
					$error = "User with this login exist! Please choose another one.";
					break;
				default :
					exit ( $e->getMessage () );
					break;
			}
		}
	}
}
?>
<!DOCTYPE HTML>
<html>
<head>
<title>Registrate | TaskTrack</title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/server.css">
</head>
<body>
	<?php if (!$ok) :?>
	<h1>Registrate Form</h1>
	<div class="error"><?=$error?></div>
	<div class="form">
		<form action="" method="post">
			<label>Login:<input type="text" name="login" value="<?=$login?>"></label>
			<label>Password:<input type="password" name="password" value="<?=$password?>"></label>
			<label>Email:<input type="text" name="email" value="<?=$email?>"></label>
			<input type="submit" name="reg" value="OK">
		</form>
		<a href="/forgot_pass">Forgot password?</a>
	</div>
	<?php else:?>
	<h1>Registrate Successfull</h1>
	<div class="form">
	Now you can use your login and password to synchronize your Task and Projects!
	<br>To start, go <a href="/">here</a>.
	</div>
	<?php endif;?>
</body>
</html>