<?php
class db
{

    public function connect()
    {
        $host = $_ENV['host'];
        $user = $_ENV['user'];
        $pass = $_ENV['pass'];
        $dbname=$_ENV['dbname'];
        
        try{

            $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
        }catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
        
    }
}