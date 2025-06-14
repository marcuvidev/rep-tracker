<?php
class User
{
    public $name;
    public $user;
    public $password;

    public function __construct() {
        $this->name = $_POST['name'] ?? '';
        $this->user = $_POST['user'] ?? '';
        $this->password = $_POST['password'] ?? '';
    }

    public function loginUser()
    {
        $user_exists = false;
        $db = new Db();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT id FROM users WHERE user = ? AND password = ?");
        $stmt->bind_param("ss", $this->user, $this->password);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            $user_exists = true;
        }

        $db->closeConnection();
        
        return $user_exists;
    }
}