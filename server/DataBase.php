<?php

require_once 'DataBaseInterface.php';

/** 
 * DataBase Class
 * @author Alex
 */
class DataBase implements \DataBaseInterface {
	/**
	 * @var string
	 */
	static private $host = 'localhost';
	/**
	 * @var string
	 */
	static private $user = 'root';
	/**
	 * @var string
	 */
	static private $pass = '';
	/**
	 * @var string
	 */
	static private $dbName = 'tt_db';
	/**
	 * @var mysqli object
	 */
	static public $db = NULL;
	
	/**
	 * Only Static use!
	 */
	function __construct() {
		return false;
	}
	/**
	 * Only Static use!
	 */
	function __clone() {
		return false;
	}
	
	function __destruct() {
		self::$db->close();
	}
	
	/* (non-PHPdoc)
	 * @see DataBaseInterface::connect()
	 */
	public static function connect() {
		if (self::$db === null) {
			self::$db = new mysqli(self::$host, self::$user, self::$pass, self::$dbName);
			if (self::$db->errno) {
				throw new RuntimeException(self::$db->error);
			}
		}
	}

}

?>