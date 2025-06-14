<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

require 'config.php';
require 'classes/Db.php';
require 'classes/User.php';

$response = [];

// Get URL path and method
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = explode('/', $path);

// Assuming your API lives at example.com/api/
$baseIndex = array_search('api', $segments); // adjust if using subdirectory
$table = $segments[$baseIndex + 1] ?? null;
$action = $segments[$baseIndex + 2] ?? null;
$id = $segments[$baseIndex + 3] ?? null;


// Return 400 if no table or action specified
if (!$table || !$action) {
    http_response_code(400);
    echo json_encode(["error" => "Table or action not specified"]);
    exit;
}

// para mañana que no me acordare
// entra la tabla y la accion declarar aqui todas las acciones sobre las tablas
// los parametros los paso por get pero los quiero pasar por post (mas seguro y limpio)
// pensar en crear una response general para los datos


switch($table) {
    case 'users':
        switch($action) {
            case 'login':
                $user = new User();
                if ($user->loginUser()) {
                    http_response_code(200);
                    echo json_encode(["exists" => true]);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode(["exists" => false, "message" => "Invalid login"]);
                }
            break;
                echo json_encode(["error" => "Action not found"]);
            default:

            break;
        }
    break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Table not found"]);
    break;
}