<?php

class Db
{

    private $conn;

    public function __construct() {
        // Database connection
        $this->conn = new mysqli(DB_SERVERNAME, DB_USERNAME, DB_PASSWORD, DB_NAME);
        if ($this->conn->connect_error) {
            die(json_encode(["error" => "DB connection failed."]));
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function closeConnection()
    {
        $this->conn->close();
    }
}