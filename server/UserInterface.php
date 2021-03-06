<?php

/** 
 * User Interface
 * @author Alex Malkevich
 */
interface UserInterface {
	/**
	 * Login user in system
	 * @param string $login - User login
	 * @param string $password - User password
	 * @return bool - logged in successful or not
	 */
	function login($login, $password);
	/**
	 * Registrate user in system
	 * @param string $login - User login
	 * @param string $password - User password
	 * @param string $email - User Email
	 * @return bool - registrated successful or not
	 */
	function register($login, $password, $email);
	/**
	 * Check if user currently logged in
	 * @return bool - logged in or not
	 */
	function isLoggedIn();
	/**
	 * Get all user data from DB
	 * @return array - user data
	 */
	function getUserData();
	/**
	 * Save/Update all/partial user data in DB
	 * @param array $data - user data
	 * @return bool - saved user data or not
	 */
	function saveUserData($data);
}

?>