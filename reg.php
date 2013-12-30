<?php
require_once '/server/User.php';

try {
	$user = new User ( "test", "test222" );
} catch ( RuntimeException $e ) {
	switch ($e->getCode ()) {
		case 1062:
			print "NOT FATAL: " . $e->getMessage ();
			break;
		default :
			exit ( $e->getMessage () );
			break;
	}
}