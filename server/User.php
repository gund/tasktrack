<?php
require_once 'UserInterface.php';
require_once 'DataBase.php';
require_once 'class.MC.php';

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
	const SECURITY_LEVEL = 1; // 0 - 9, Highest more securly
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
	function __construct() {
		DataBase::connect ();
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::login()
	 */
	public function login($login, $password) {
		if ($this->validLoginPass ( $login, $password )) {
			return false;
		}
		$ret = false;
		if ($stmt = DataBase::$db->prepare ( "SELECT * FROM users WHERE login=? LIMIT 1" )) {
			$stmt->bind_param ( 's', $login );
			$stmt->execute ();
			$result = $stmt->get_result ();
			if ($result->num_rows == 0) {
				$this->state = self::U_LOG_OUT;
				$ret = false;
			} else {
				$userInfo = $result->fetch_array ( MYSQLI_ASSOC );
				$mc = new MultiCrypting ();
				$truePass = $mc->decode ( $userInfo ["password"] );
				if ($password === $truePass) {
					$this->login = $userInfo ["login"];
					$this->password = $userInfo ["password"];
					$this->id = $userInfo ["id"];
					$this->state = self::U_LOG_IN;
					$ret = true;
				} else {
					$this->state = self::U_LOG_OUT;
					$ret = false;
				}
			}
			$stmt->close ();
		} else
			throw new RuntimeException ( $stmt->error, 0 );
		return $ret;
	}
	
	/*
	 * (non-PHPdoc) @see UserInterface::register()
	 */
	public function register($login, $password, $email) {
		if ($this->validLoginPass ( $login, $password )) {
			return false;
		}
		$ret = false;
		$mc = new MultiCrypting();
		$password = $mc->encode($password, self::SECURITY_LEVEL);
		if ($stmt = DataBase::$db->prepare ( "INSERT INTO users VALUES (NULL, ?, ?, ?, NULL)" )) {
			$stmt->bind_param ( 'sss', $login, $password, $email );
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
		return ( bool ) $this->state;
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
		if ($stmt = DataBase::$db->prepare ( "SELECT data FROM tasks WHERE user_id=? LIMIT 1" )) {
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
		if (! is_array ( $data ) || ($what != 'p' && $what != 't')) {
			return false;
		}
		$what = ($what == 'p') ? 'projects' : 'tasks';
		$selectQuery = "SELECT * FROM $what WHERE user_id=?";
		$deleteQuery = "DELETE FROM $what WHERE id=? AND user_id=?";
		$insertQuery = "INSERT INTO $what VALUES (NULL, ?, ?, NULL)";
		$updateQuery = "UPDATE $what SET data=? WHERE id=? AND user_id=?";
		// Get Id to save
		$dataId = null;
		$stmt = DataBase::$db->prepare ( $selectQuery );
		if (! $stmt) {
			throw new RuntimeException ( "SQL Error in SQL Statements!" );
		}
		$stmt->bind_param ( 'i', $this->id );
		$stmt->execute ();
		$result = $stmt->get_result ();
		if ($result->num_rows != 0) {
			$arInfo = $result->fetch_array ( MYSQLI_ASSOC );
			$dataId = $arInfo ["id"];
		}
		// Modify data to normal state
		foreach ( $data as &$arData ) {
			if ($arData ["status"] == 0) {
				unset($data[$arData["id"]]);
			} else {
				$arData ["status"] = 1;
			}
		}
		// Save Data
		$stmt->reset ();
		if ($dataId === null) {
			// Insert
			$stmt->prepare ( $insertQuery );
			$stmt->bind_param ( 'is', $this->id, serialize ( $data ) );
		} else {
			// Update
			$stmt->prepare ( $updateQuery );
			$stmt->bind_param ( 'sii', serialize ( $data ), $dataId, $this->id );
		}
		$stmt->execute ();
		$ret = (! DataBase::$db->errno) ? true : false;
		$stmt->close ();
		return $ret;
	}
	public function getState() {
		return $this->state;
	}
}

?>