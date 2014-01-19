<?php

/** 
 * @author Alex Malkevich
 * @name Multi Crypting Class
 * @desc This class created for crypt strings
 * @date 13.01.2012
 */
class MultiCrypting {
	const MC_CHIPER = MCRYPT_RIJNDAEL_256;
	const MC_MODE = MCRYPT_MODE_ECB;
	private $str;
	private $global_str;
	private $global_salt;
	private $random_salt;
	private $salt_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	private $salt_symbols = '!@#$%^&*()_+=~[]/<>';
	// For encode
	private $encoded_rand_salt;
	private $encoded_str;
	private $encoded_state = 1;
	// For decode
	private $decoded_rand_salt;
	private $decoded_str;
	private $decoded_state = 1;
	function __construct() {
		$this->setGlobal_salt ();
	}
	public function getStr() {
		return $this->global_str;
	}
	public function setStr($str) {
		$this->str = $str;
		$this->global_str = $str;
	}
	public function getGlobal_salt() {
		return $this->global_salt;
	}
	private function setGlobal_salt() {
		$this->global_salt = "OlolO";
	}
	public function getRandom_salt() {
		return $this->random_salt;
	}
	private function setRandom_salt($random_salt) {
		$this->random_salt = $random_salt;
	}
	public function getEncoded_rand_salt() {
		return $this->encoded_rand_salt;
	}
	public function getEncoded_str() {
		return $this->encoded_str;
	}
	public function getEncoded_state() {
		return $this->encoded_state;
	}
	public function getDecoded_rand_salt() {
		return $this->decoded_rand_salt;
	}
	public function getDecoded_str() {
		return $this->decoded_str;
	}
	public function getDecoded_state() {
		return $this->decoded_state;
	}
	public function decodeInput($input = NULL) {
		if ($input === null) {
			return;
		}
		$inpInfo = $this->prepareInput ( $input );
		$key = $this->generateKeyFromTime ( $inpInfo ["time"] );
		$text = pack ( "H*", $inpInfo ["passHex"] );
		$iv_size = mcrypt_get_iv_size ( self::MC_CHIPER, self::MC_MODE );
		$iv = mcrypt_create_iv ( $iv_size, MCRYPT_RAND );
		return trim ( @mcrypt_decrypt ( self::MC_CHIPER, $key, $text, self::MC_MODE, $iv ) );
	}
	private function prepareInput($input = NULL) {
		if ($input === null) {
			return;
		}
		$input = base64_decode ( $input );
		$timeStamp = pack ( "H*", substr ( $input, 0, 26 ) );
		$passHex = substr ( $input, 26 );
		return array (
				"passHex" => $passHex,
				"time" => $timeStamp 
		);
	}
	private function generateKeyFromTime($time, $size = 32) {
		$d = $time;
		$keyH = "";
		for($i = 6; $i >= 0; -- $i) {
			// Get High byte
			$keyH .= substr ( strval ( (int)$d [12 - $i] ^ (int)$d [7 - $i] ), 0, 1 );
		}
		$lol = abs($time+0);
		$tmp = strval ( abs ( $lol >> 3 ) );
		$key = $tmp . $keyH;
		if ($size == 32) {
			$key = bin2hex ( $key );
		}
		return $key;
	}
	public function encode($text, $multiple = 1) {
		$multiple = intval ( $multiple );
		if ($multiple > 9)
			$multiple = 9;
		$this->encoded_state = $multiple;
		$this->setStr ( $text );
		
		for($i = 0; $i < $multiple; $i ++) {
			$salt_length = $this->generate_random_salt ();
			$this->encoded_rand_salt = $salt_length . $this->random_salt . $this->iv_encode ();
			if ($multiple > 1)
				$this->str = $this->iv_encode ( true );
		}
		$this->encoded_str = $multiple . $this->iv_encode ( true );
		return $this->encoded_str;
	}
	public function decode($text) {
		$this->setStr ( $text );
		$this->decoded_state = $this->cut_char ( $text, 0 );
		$this->str = substr ( $text, 1 );
		
		for($i = 0; $i < $this->decoded_state; $i ++) {
			$this->decoded_rand_salt = $this->iv_decode ( true );
			$salt_info = $this->get_first_nums ( $this->decoded_rand_salt );
			$salt_length = $salt_info [0];
			// $salt_length = $this->cut_char($this->decoded_rand_salt, 0);
			$this->decoded_rand_salt = substr ( $this->decoded_rand_salt, $salt_info [1] );
			$this->random_salt = $this->cut_char ( $this->decoded_rand_salt, 0, $salt_length );
			$this->decoded_rand_salt = substr ( $this->decoded_rand_salt, $salt_length );
			if ($this->decoded_state > 1)
				$this->str = $this->iv_decode ();
		}
		$this->decoded_str = $this->iv_decode ();
		return $this->decoded_str;
	}
	private function generate_random_salt($length = 5, $symbols = true) {
		$symbols = true;
		$salt = "";
		$chars_size = strlen ( $this->salt_chars );
		$symbols_size = strlen ( $this->salt_symbols );
		for($i = 0; $i < $length; $i ++) {
			$salt .= $this->cut_rand_char ( $this->salt_chars, $chars_size );
		}
		if ($symbols == true) {
			$salt = $this->cut_rand_char ( $this->salt_symbols, $symbols_size ) . $salt . $this->cut_rand_char ( $this->salt_symbols, $symbols_size );
			$length += 2;
		}
		$this->setRandom_salt ( $salt );
		return $length;
	}
	private function cut_rand_char($str, $strlen, $len2cut = 1) {
		return substr ( $str, rand ( 1, $strlen ) - 1, $len2cut );
	}
	private function cut_char($str, $start, $len2cut = 1) {
		return substr ( $str, $start, $len2cut );
	}
	private function iv_encode($global = false) {
		$iv_size = mcrypt_get_iv_size ( self::MC_CHIPER, self::MC_MODE );
		$iv = mcrypt_create_iv ( $iv_size, MCRYPT_RAND );
		if ($global == true) {
			$key = $this->global_salt;
			$text = $this->encoded_rand_salt;
		} else {
			$key = $this->random_salt;
			$text = $this->str;
		}
		return base64_encode ( @mcrypt_encrypt ( self::MC_CHIPER, $key, $text, self::MC_MODE, $iv ) );
	}
	private function iv_decode($global = false) {
		$iv_size = mcrypt_get_iv_size ( self::MC_CHIPER, self::MC_MODE );
		$iv = mcrypt_create_iv ( $iv_size, MCRYPT_RAND );
		if ($global == true) {
			$key = $this->global_salt;
			$text = $this->str;
		} else {
			$key = $this->random_salt;
			$text = $this->decoded_rand_salt;
		}
		return trim ( @mcrypt_decrypt ( self::MC_CHIPER, $key, base64_decode ( $text ), self::MC_MODE, $iv ) );
	}
	private function get_first_nums($str) {
		$numbers = 0;
		$nums_length = 0;
		for($i = 0; $i < strlen ( $str ); $i ++) {
			if (is_numeric ( $str [$i] )) {
				$numbers .= ( int ) substr ( $str, $i, 1 );
				$nums_length ++;
			} else
				break;
		}
		return array (
				$numbers,
				$nums_length 
		);
	}
}

?>