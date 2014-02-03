<?php

const E_INV_SYNC_METHOD = 100;
const E_MISS_DATA = 101;
const E_MISS_LOGIN_PASS = 102;
const E_INV_LOGIN_PASS = 103;
const E_FAIL_SAVE_DATA = 104;
function exitWithError($errrorNo = NULL) {
	switch ($errrorNo) {
		case E_INV_SYNC_METHOD :
			$msg = 'Invalid sync method';
			break;
		
		case E_MISS_DATA :
			$msg = 'Missing data to sync';
			break;
		
		case E_MISS_LOGIN_PASS :
			$msg = 'Missing user login/password';
			break;
		
		case E_INV_LOGIN_PASS :
			$msg = 'Invalid user login/password';
			break;
		
		case E_FAIL_SAVE_DATA :
			$msg = 'Failed to save data';
			break;
		
		default :
			$errrorNo = 0;
			$msg = 'Unknown error';
			break;
	}
	exit ( json_encode ( array (
			'status' => $errrorNo,
			'msg' => $msg 
	) ) );
}
function responseOk($msg = NULL, $data = NULL, $method = NULL) {
	$res ["status"] = 200;
	if ($data !== null)
		$res ["data"] = $data;
	if ($msg !== null)
		$res ["msg"] = $msg;
	if ($method !== null)
		$res ["method"] = $method;
	exit ( json_encode ( $res ) );
}
function preparePassword($pass) {
	$mc = new MultiCrypting();
	return $mc->decodeInput($pass);
}
function int64ToInt32($int64) {
	$int32 = $int64;
	if($int64 < 0) {
		$int32 &= 0x00000000ffffffff;
	} elseif ($int64 > 0) {
		$int32 |= 0xffffffff00000000;
	}
	return $int32;
}