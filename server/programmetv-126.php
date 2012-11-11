<?php
header('Content-type: application/json');

$link = mysql_connect('localhost', 'user', 'password');
mysql_select_db('programmetv');


$view = $_POST['view'];
$catalog = $_POST['catalog'];
$model = $_POST['model'];
$platformVersion = $_POST['platformVersion'];
$width = $_POST['width'];
$height = $_POST['height'];
$serial = $_POST['serial'];
$carrier = $_POST['carrier'];
$appVersion = $_POST['appVersion'];
$appVersionStatus = $_POST['appVersionStatus'];
$ln = array ('cat', 'fr', 'en', 'de', 'es', 'it');
$lang = $ln[$_POST['lang']];
$timestamp = $_POST['timestamp'];

/*
// $query = "SELECT `channel_old`.`name`, `channel_old`.`name2`, `programme`.`title`, `programme`.`desc`, UNIX_TIMESTAMP(`programme`.`start`) AS 'start', UNIX_TIMESTAMP(`programme`.`stop`) AS 'stop', `programme`.`length`, `programme`.`date` FROM `channel_old`, `programme` WHERE `channel_old`.`id` = `programme`.`channel` && `programme`.`start` < NOW() && `programme`.`stop` > NOW() && `channel_old`.`nb` != 0 ORDER BY `channel_old`.`nb` ASC";

$view = 'now';
$catalog = 'fr';
*/
// if ($serial != 'Unknown' && $serial != 'Inconnu') {
	$query = mysql_query("INSERT INTO `stat`(`view`, `catalog`, `model`, `platformVersion`, `width`, `height`, `serial`, `carrier`, `appVersion`, `appVersionStatus`, `lang`, `date`, `userDate`) VALUES('$view', '$catalog', '$model', '$platformVersion', '$width', '$height', '$serial', '$carrier', '$appVersion', '$appVersionStatus', '$lang', NOW(), FROM_UNIXTIME($timestamp))");
// }

if (strcmp($catalog, 'en') == 0) {
	$catalog = 'gb';
}

switch($view) {
	case 'now': {
		if (strcmp($catalog, 'fr') == 0) {
			$query = "SELECT `channel_old`.`name`, `channel_old`.`name2`, `programme`.`title`, `programme`.`desc`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start', UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) AS 'stop', `programme`.`length`, `programme`.`date` FROM `channel_old`, `programme` WHERE `channel_old`.`id` = `programme`.`channel` && UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) < $timestamp && UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) > $timestamp && `channel_old`.`nb` != 0 && `channel_old`.`country` = 'fr' ORDER BY `channel_old`.`nb` ASC";
		}
		else {
			$query = "SELECT `channel`.`name`, `channel`.`name2`, `programme`.`title`, `programme`.`desc`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start', UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) AS 'stop', `programme`.`length`, `programme`.`date` FROM `channel`, `programme` WHERE `channel`.`id` = `programme`.`channel` && UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) < $timestamp && UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) > $timestamp && `channel`.`country` = '$catalog' ORDER BY `channel`.`name` ASC";
			//$query = "SELECT `channel_$catalog`.`channel`, `programme_$catalog`.`title`, `programme_$catalog`.`desc`, UNIX_TIMESTAMP(`programme_$catalog`.`start`) AS 'start', UNIX_TIMESTAMP(`programme_$catalog`.`stop`) AS 'stop', `programme_$catalog`.`length`, `programme_$catalog`.`date` FROM `channel_$catalog`, `programme_$catalog` WHERE `channel_$catalog`.`id` = `programme_$catalog`.`channel` && `programme_$catalog`.`start` < FROM_UNIXTIME($timestamp) && `programme_$catalog`.`stop` > FROM_UNIXTIME($timestamp) && NOT(`channel_$catalog`.`channel` LIKE '%HD' ) ORDER BY `channel_$catalog`.`channel` ASC";
        }
		break;
    }
	case 'night': {
		$nightHour = $_POST['nightHour'] - $_POST['timeDiff'];
		$nightMinutes = $_POST['nightMinutes'];
		if (strcmp($catalog, 'fr') == 0) {
			$query = "SELECT `channel_old`.`name`, `channel_old`.`name2`, `programme`.`title`, `programme`.`desc`, `programme`.`rating`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start', UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) AS 'stop', `programme`.`length`, `programme`.`date` FROM `channel_old`, `programme` WHERE `channel_old`.`id` = `programme`.`channel` && TIME(`programme`.`start`) >= TIME('$nightHour:$nightMinutes:00') && DATE(`programme`.`start`) = DATE(FROM_UNIXTIME($timestamp)) && `programme`.`length` > 5 && `channel_old`.`nb` != 0 && `channel_old`.`country` = 'fr' ORDER BY `channel_old`.`nb` ASC";
			// $query = "SELECT `channel_$catalog`.`channel`, `programme_$catalog`.`title`, `programme_$catalog`.`desc`, UNIX_TIMESTAMP(`programme_$catalog`.`start`) AS 'start', UNIX_TIMESTAMP(`programme_$catalog`.`stop`) AS 'stop', `programme_$catalog`.`length`, `programme_$catalog`.`date` FROM `channel_$catalog`, `programme_$catalog` WHERE `channel_$catalog`.`id` = `programme_$catalog`.`channel` && TIME(`programme_$catalog`.`start`) >= TIME('$nightHour:$nightMinutes:00') && DATE(`programme_$catalog`.`start`) = DATE(FROM_UNIXTIME($timestamp)) && `programme_$catalog`.`length` > 5 && NOT(`channel_$catalog`.`channel` LIKE '%HD' ) && `channel_$catalog`.`nb` != 0 ORDER BY `channel_$catalog`.`nb` ASC";
 		}
		else {
			$query = "SELECT `channel`.`name`, `channel`.`name2`, `programme`.`title`, `programme`.`desc`, `programme`.`rating`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start', UNIX_TIMESTAMP(`programme`.`stop`) + (3600 * 2) AS 'stop', `programme`.`length`, `programme`.`date` FROM `channel`, `programme` WHERE `channel`.`id` = `programme`.`channel` && TIME(`programme`.`start`) >= TIME('$nightHour:$nightMinutes:00') && DATE(`programme`.`start`) = DATE(FROM_UNIXTIME($timestamp)) && `programme`.`length` > 5 && `channel`.`country` = '$catalog' ORDER BY `channel`.`name` ASC";
			// $query = "SELECT `channel_$catalog`.`channel`, `programme_$catalog`.`title`, `programme_$catalog`.`desc`, UNIX_TIMESTAMP(`programme_$catalog`.`start`) AS 'start', UNIX_TIMESTAMP(`programme_$catalog`.`stop`) AS 'stop', `programme_$catalog`.`length`, `programme_$catalog`.`date` FROM `channel_$catalog`, `programme_$catalog` WHERE `channel_$catalog`.`id` = `programme_$catalog`.`channel` && TIME(`programme_$catalog`.`start`) >= TIME('$nightHour:$nightMinutes:00') && DATE(`programme_$catalog`.`start`) = DATE(FROM_UNIXTIME($timestamp)) && `programme_$catalog`.`length` > 5 && NOT(`channel_$catalog`.`channel` LIKE '%HD' ) ORDER BY `channel_$catalog`.`channel` ASC";
        }
		break;
    }
	case 'channels': {
		$day = $_POST['day'];
		$channel = $_POST['channel'];
       if (strcmp($catalog, 'fr') == 0) {
			$query = "SELECT `channel_old`.`name`, `channel_old`.`name2`, `programme`.`title`, `programme`.`desc`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start' FROM `channel_old`, `programme` WHERE `channel_old`.`id` = `programme`.`channel` && DATE(`programme`.`start`) = (DATE(NOW()) + $day) && DATE(`programme`.`start`) < DATE(NOW()) + 7 && `channel_old`.`nb` != 0 && (`channel_old`.`name` = '$channel' OR `channel_old`.`name2` = '$channel') ORDER BY `programme`.`start` ASC";
 		}
		else {
			$query = "SELECT `channel`.`name`, `channel`.`name2`, `programme`.`title`, `programme`.`desc`, UNIX_TIMESTAMP(`programme`.`start`) + (3600 * 2) AS 'start' FROM `channel`, `programme` WHERE `channel`.`id` = `programme`.`channel` && DATE(`programme`.`start`) = (DATE(NOW()) + $day) && DATE(`programme`.`start`) < DATE(NOW()) + 7 && (`channel`.`name` = '$channel' OR `channel`.`name2` = '$channel') ORDER BY `programme`.`start` ASC";
			// $query = "SELECT `programme_$catalog`.`title`, `programme_$catalog`.`desc`, UNIX_TIMESTAMP(`programme_$catalog`.`start`) AS 'start' FROM `channel_$catalog`, `programme_$catalog` WHERE `channel_$catalog`.`id` = `programme_$catalog`.`channel` && DATE(`programme_$catalog`.`start`) = (DATE(NOW()) + $day) && DATE(`programme_$catalog`.`start`) < DATE(NOW()) + 7 && `channel_$catalog`.`channel` = '$channel' ORDER BY `programme_$catalog`.`start` ASC";
        }
		break;
    }
}



$result = mysql_query($query);
$all_recs = array();
while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
	$all_recs[] = $line;
}

// include('JSON.php');
// $json = new Services_JSON();

// echo $json->encode($all_recs);

echo json_encode($all_recs);
mysql_close($link);
?>
