<?php

/** 
 * DataBase Interface
 * @author Alex
 */
interface DataBaseInterface {
	/**
	 * Create mysqli object and connect to MySQL DB
	 */
	public static function connect();
}

?>