<?php
require_once '/server/User.php';

$error = "";
$ok = 0;

$login = null;

if (isset ( $_POST ['ok'] )) {
	$login = (! empty ( $_POST ['login'] )) ? $_POST ['login'] : null;
	
	if ($login === null) {
		$error = "Please, fill login field.";
	} else {
		try {
			DataBase::connect ();
			$db = DataBase::$db;
			$sql = "SELECT email FROM users WHERE login=? LIMIT 1";
			$stmt = $db->prepare($sql);
			if (!$stmt) {
				throw new RuntimeException("Failed to init MySql Statment!");
			}
			$stmt->bind_param('s', $login);
			$stmt->execute();
			$result = $stmt->get_result ();
			if ($result->num_rows == 0) {
				$error = "User with this login does not exist.";
			} else {
				$userInfo = $result->fetch_array ( MYSQLI_ASSOC );
				$pass = $userInfo["password"];
				$email = $userInfo["email"];
				$mc = new MultiCrypting();
				$pass = $mc->decode($pass);
				$loginToEmail = ucfirst($login);
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
				$headers .= 'From: TaskTrack <info@ttrack.tk>' . "\r\n";
				$headers .= "To: $loginToEmail <$email>\r\n";
				$html = <<< EOT
<html>
<head>
<title>Forgot Password</title>
</head>
<body>
Dear <strong>{$loginToEmail}</strong>,
<br><br>
You request your password on <a href="">TaskTrack</a>. If you don't please, ignore this email.<br>
Your password: <strong>{$pass}</strong>
<br><br>		
Best regards,<br>
TaskTrack.
</body>
</html>
EOT;
				$html = wordwrap($html, 70);
				if (@mail($email, "Forgot Password | TaskTrack", $html, $headers))
					$ok = 1;
				else 
					$error = "Failed to send email to $email";
			}
		} catch ( Exception $e ) {
			exit ( $e->getMessage () );
		}
	}
}

?>
<!DOCTYPE HTML>
<html>
<head>
<title>Forgot Password | TaskTrack</title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/server.css">
</head>
<body>
	<?php if (!$ok) :?>
	<h1>Forgot Password Form</h1>
	<div class="error"><?=$error?></div>
	<div class="form">
		<form action="" method="post">
			<label>Login:<input type="text" name="login" value="<?=$login?>"></label> <input
				type="submit" name="ok" value="Ok">
		</form>
	</div>
	<?php else:?>
	<h1>Password Sent</h1>
	<div class="form">
		Password have been sent to <strong><?=$email?></strong>. Check it, please!
	</div>
	<?php endif;?>
</body>
</html>