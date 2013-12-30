<?php
require_once 'UserInterface.php';
require_once 'DataBase.php';

/**
 * User Class
 *
 * @author Alex Malkevich
 */
class User implements \UserInterface {
	const U_LOG_IN = 1;
	const U_LOG_OUT = 0;
	const DATA_SATE_NOTFOUND = 0;
	const DATA_STATE_FOUND = 1;
	const DATA_STATE_MODIFIYED = 2;
	/**
	 *
	 * @var string
	 */
	private $login;
	/**
	 *
	 * @var string
	 */
	private $password;
	/**
	 * User ID
	 *
	 * @var int
	 */
	private $id;
	private $projects;
	private $tasks;
	/**
	 * Current state of User
	 *
	 * @var int (0 - U_LOG_OUT | 1 - U_LOG_IN)
	 */
	private $state = self::U_LOG_OUT;
	
	/**
	 * Login first, if not - registrate user
	 *
	 * @param string $login        	
	 * @param string $password        	
	 */
	function __construct($login, $password) {
		DataBase::connect ();
		if (! $this->login ( $login, $password )) {
			$this->register ( $login, $password );
		}
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::login()
	 */
	public function login($login, $password) {
		if ($this->validLoginPass ( $login, $password )) {
			return false;
		}
		$ret = false;
		if ($stmt = DataBase::$db->prepare ( "SELECT * FROM users WHERE login=? AND password=? LIMIT 1" )) {
			$stmt->bind_param ( 'ss', $login, $password );
			$stmt->execute ();
			$result = $stmt->get_result ();
			if ($result->num_rows == 0) {
				$this->state = self::U_LOG_OUT;
				$ret = false;
			} else {
				$userInfo = $result->fetch_array ( MYSQLI_ASSOC );
				$this->login = $userInfo ["login"];
				$this->password = $userInfo ["password"];
				$this->id = $userInfo ["id"];
				$this->state = self::U_LOG_IN;
				$ret = true;
			}
			$stmt->close ();
		} else
			throw new RuntimeException ( $stmt->error, 0 );
		return $ret;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::register()
	 */
	public function register($login, $password) {
		if ($this->validLoginPass ( $login, $password )) {
			return false;
		}
		$ret = false;
		if ($stmt = DataBase::$db->prepare ( "INSERT INTO users VALUES (NULL, ?, ?, NULL)" )) {
			$stmt->bind_param ( 'ss', $login, $password );
			$stmt->execute ();
			if ($stmt->errno) {
				$this->state = self::U_LOG_OUT;
				$ret = false;
				throw new RuntimeException ( $stmt->error, $stmt->errno );
			} elseif ($stmt->affected_rows == 1) {
				$this->login = $login;
				$this->password = $password;
				$this->id = $stmt->insert_id;
				$this->state = self::U_LOG_IN;
				$ret = true;
			} else
				throw new RuntimeException ( "Unknown SQL error!", 0 );
			$stmt->close ();
		} else
			throw new RuntimeException ( $stmt->error, 0 );
		return $ret;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::isLoggedIn()
	 */
	public function isLoggedIn() {
		return $this->state;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::getUserData()
	 */
	public function getUserData() {
		if ($this->isLoggedIn ()) {
			$this->getProjects ();
			$this->getTasks ();
			$data = array (
					"projects" => $this->projects,
					"tasks" => $this->tasks 
			);
			return $data;
		} else
			return false;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::saveUserData()
	 */
	public function saveUserData($data) {
		if (! is_array ( $data ) || ! isset ( $data ["projects"] ) || ! isset ( $data ["tasks"] )) {
			return false;
		}
		try {
			$step1 = $this->saveProjAndTasks ( 'p', $data ["projects"] );
			$step2 = $this->saveProjAndTasks ( 't', $data ["tasks"] );
		} catch ( RuntimeException $e ) {
			return false;
		}
		if ($step1 && $step2)
			return true;
		else
			return false;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::compareUserData()
	 */
	public function compareUserData($newData) {
		$data = $this->getUserData ();
		if (! $data || ! is_array ( $newData ) || ! isset ( $newData ["projects"] ) || ! isset ( $newData ["tasks"] )) {
			return false;
		}
		// Compare projects
		$newIsBigger = ( bool ) (sizeof ( $newData ["projects"] ) > sizeof ( $data ["projects"] ));
		$bigger = ($newIsBigger) ? $newData ["projects"] : $data ["projects"];
		$smaller = (! $newIsBigger) ? $newData ["projects"] : $data ["projects"];
		// Prepare bigger arrays into one
		$projBig = array ();
		for($a = sizeof ( $bigger ); $a >= 0; $a ++) {
			foreach ( $bigger [$a] ["data"] as &$val )
				$val ["status"] = 'D';
			$projBig .= $bigger [$a] ["data"];
		}
		// Comparing
		for($i = sizeof ( $smaller ); $i >= 0; $i ++) {
			for($j = sizeof ( $smaller [$i] ["data"] ); $j >= 0; $j ++) {
				$id = $smaller [$i] ["data"] [$j] ["id"];
				$name = $smaller [$i] ["data"] [$j] ["name"];
				$state = self::DATA_SATE_NOTFOUND;
				foreach ( $projBig as $big ) {
					if ($big ["id"] == $id) {
						$state = self::DATA_STATE_FOUND;
						if ($big ["id"] != $name) {
							$state = self::DATA_STATE_MODIFIYED;
						}
						break;
					}
				}
				switch ($state) {
					case self::DATA_SATE_NOTFOUND :
						
						break;
					case self::DATA_STATE_FOUND :
						
						break;
					case self::DATA_STATE_MODIFIYED :
						
						break;
				}
			}
		}
	}
	
	/**
	 * Validate login & password
	 *
	 * @param string $login        	
	 * @param string $pass        	
	 */
	private function validLoginPass($login, $pass) {
		if (! is_string ( $login ) || ! is_string ( $password ) || strlen ( $login ) == 0 || strlen ( $password ) == 0) {
			return false;
		}
		return true;
	}
	
	/**
	 * Get all projects from DB
	 *
	 * @throws RuntimeException on SQL Error
	 * @return array - Projects data
	 */
	private function getProjects() {
		$this->projects = null;
		if ($stmt = DataBase::$db->prepare ( "SELECT data FROM projects WHERE user_id=? LIMIT 1" )) {
			$stmt->bind_param ( "i", $this->id );
			$stmt->execute ();
			$result = $stmt->get_result ();
			if ($result->num_rows != 0) {
				$arProj = $result->fetch_array ( MYSQLI_ASSOC );
				$this->projects = unserialize ( $arProj ["data"] );
			}
			$stmt->close ();
		} else
			throw new RuntimeException ( $stmt->error );
		return $this->projects;
	}
	
	/**
	 * Get all data from DB
	 *
	 * @throws RuntimeException on SQL Error
	 * @return array - Tasks data
	 */
	private function getTasks() {
		$this->tasks = null;
		if ($stmt = DataBase::$db->prepare ( "SELECT id, data FROM tasks WHERE user_id=? LIMIT 1" )) {
			$stmt->bind_param ( "i", $this->id );
			$stmt->execute ();
			$result = $stmt->get_result ();
			if ($result->num_rows != 0) {
				$arTasks = $result->fetch_array ( MYSQLI_ASSOC );
				$this->tasks = unserialize ( $arTasks ["data"] );
			}
			$stmt->close ();
		} else
			throw new RuntimeException ( $stmt->error );
		return $this->tasks;
	}
	
	/**
	 * Save all projects/tasks to DB
	 *
	 * @param char $what
	 *        	- What save (p - Projects | t - Tasks)
	 * @param array $projects
	 *        	- Data to save
	 * @throws RuntimeException on SQL Error
	 * @return boolean - Saved or not
	 */
	private function saveProjAndTasks($what, $data) {
		if (! is_array ( $data ) || empty ( $data ) || ($what != 'p' && $what != 't')) {
			return false;
		}
		$what = ($what == 'p') ? 'projects' : 'tasks';
		$deleteQuery = "DELETE FROM ? WHERE id=? AND user_id=?";
		$insertQuery = "INSERT INTO ? VALUES (NULL, ?, ?)";
		$updateQuery = "UPDATE ? SET data=? WHERE id=? AND user_id=?";
		$stmt = DataBase::$db->stmt_init ();
		if (! $stmt) {
			throw new RuntimeException ( "SQL Error in SQL Statements!" );
		}
		foreach ( $data as $arProj ) {
			foreach ( $arProj ["data"] as &$project ) {
				if (isset ( $project ["status"] ) && $project ["status"] == 'D')
					unset ( $project );
				else
					unset ( $project ["status"] );
			}
			if (empty ( $arProj ["data"] )) {
				// Delete
				$stmt->prepare ( $deleteQuery );
				$stmt->bind_param ( 'sii', $what, $arProj ["id"], $this->id );
			} elseif (! isset ( $arProj ["id"] )) {
				// Insert
				$stmt->prepare ( $insertQuery );
				$stmt->bind_param ( 'sis', $what, $this->id, serialize ( $arProj ["data"] ) );
			} else {
				// Update
				$stmt->prepare ( $updateQuery );
				$stmt->bind_param ( 'ssii', $what, serialize ( $arProj ["data"] ), $arProj ["id"], $this->id );
			}
			$stmt->execute ();
		}
		$stmt->close ();
		return true;
	}
}

?>