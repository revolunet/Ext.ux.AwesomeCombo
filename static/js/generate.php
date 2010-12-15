#!/usr/bin/env php
<?php

$data = array(
	'@version' => (empty($_GET['version']) ? '0.1' : $_GET['version']),
	'@author' => (empty($_GET['author']) ? 'Revolunet' : $_GET['author'])
);

$root = dirname(__FILE__).'/';
$output = 'Ext.ux.BeeCombo.js';

$files = array(
	'core.js',
	'events.js',
	'tooltip.js',
	'paging.js',
	'format.js'
);

ob_start();
echo '<pre>';
if (file_exists($root.$output)) {
	unlink($root.$output);
	echo '[-] "', $root, $output, '" deleted.', chr(10);
}
foreach ($files as $file) {
	$content = file_get_contents($root.'src/'.$file).chr(10).chr(10);
	foreach ($data as $key => $value) {
		$content = str_replace($key, $key.' '.$value, $content);
	}
	file_put_contents($root.$output, $content, FILE_APPEND);
}

echo '[+] "', $root, $output, '" generated.', chr(10), '</pre>';
$debug = ob_get_clean();

header('Location: ../js/'.$output);