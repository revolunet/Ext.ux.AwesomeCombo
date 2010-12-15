<?php

header('Content-Type: text/json');

print json_encode(
	array(
		array('id' => 1, 'name' => 'toto')
		,array('id' => 2, 'name' => 'titi')
		,array('id' => 3, 'name' => 'tata')
	)
);

?>