<?php
$sourceInt = 1397236742173;
$sourceInt32 = int64ToInt32($sourceInt);
$resultInt = $sourceInt >> 3;
$resultInt32 = $sourceInt32 >> 3;

var_dump($sourceInt);
echo "<br>TEST:<br>";
echo "Source Int: " . $sourceInt;
echo "<br>x64: " . $resultInt;
echo "<br>x32: " . $resultInt32;
echo "<br>Need: 171546371<br>";

$binSource = unpack ( "C*", pack ( "L", $sourceInt ) );
$binInt = unpack ( "C*", pack ( "L", $resultInt ) );
$binInt32 = unpack ( "C*", pack ( "L", $resultInt32 ) );

echo "<br>Binaries:<br>Source bin: ";
var_dump ( $binSource );
echo "<br>x64 bin: ";
var_dump ( $binInt );
echo "<br>x32 bin: ";
var_dump ( $binInt32 );

// Functions
function int64ToInt32($int64) {
	$int32 = $int64;
	if($int64 > 0) {
		$int32 &= 0x00000000ffffffff;
	} elseif ($int64 < 0) {
		$int32 |= 0xffffffff00000000;
	}
	return $int32;
}
function gmp_shiftl($x, $n) { // shift left
	return (gmp_mul ( $x, gmp_pow ( 2, $n ) ));
}
function gmp_shiftr($x, $n) { // shift right
	return (gmp_div ( $x, gmp_pow ( 2, $n ) ));
}