<?php
require_once 'header.php';

$login = (isset ( $_POST ["login"] )) ? $_POST ["login"] : exitWithError ( E_MISS_LOGIN_PASS );
$password = (isset ( $_POST ["password"] )) ? $_POST ["password"] : exitWithError ( E_MISS_LOGIN_PASS );
$method = (isset ( $_POST ["method"] )) ? $_POST ["method"] : exitWithError ( E_INV_SYNC_METHOD );
$inputData = (isset ( $_POST ["data"] )) ? $_POST ["data"] : null;

// Validate input data
if ($method === null || ($method != 's2c' & $method != 'c2s'))
	exitWithError ( E_INV_SYNC_METHOD );
if ($method == 'c2s' && ($inputData === null || $inputData == ''))
	exitWithError ( E_MISS_DATA );

$user = new User ();
$password = preparePassword ( $password );
if (! $user->login ( $login, $password )) {
	exitWithError ( E_INV_LOGIN_PASS );
}

if ($method === 's2c') {
	$data = $user->getUserData ();
	responseOk ( "Success", $data, $method );
} elseif ($method === 'c2s') {
	$data = json_decode ( $inputData, true );
	$res = $user->saveUserData ( $data );
	if ($res) {
		responseOk ( "Success", null, $method );
	} else {
		exitWithError ( E_FAIL_SAVE_DATA );
	}
} else
	exitWithError ( E_INV_SYNC_METHOD );