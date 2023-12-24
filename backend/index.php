<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Tuupola\Middleware\CorsMiddleware;
use Slim\Psr7\Response as SlimResponse;
use Psr\Http\Server\RequestHandlerInterface;
use Firebase\JWT\JWT;

require __DIR__.'/./vendor/autoload.php';
require __DIR__.'/./src/config/db.php';
require_once __DIR__ . '/src/Middleware/JwtMiddleware.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$app = AppFactory::create();
$app->add(new CorsMiddleware());


$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write("Prushotam Kumar");
    return $response;
});

//This route is related to  users
$app->group('/api/users', function (RouteCollectorProxy $group)  {

    $group->post('/register', function (Request $request, Response $response) {
        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
        
        $name = $requestData['name']; 
        $email = $requestData['email']; 
        $password = $requestData['password'];

        try {
            // get db object
            $db = new db();
            // connect
            $pdo = $db->connect();
           
            $checkIfExists = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $checkIfExists->execute([$email]);

        if ($checkIfExists->rowCount() > 0) {
        
            $response->getBody()->write("User with this email already exits");
            return $response->withStatus(201);
        }

        $hashedpassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        error_log($hashedpassword);
        $pdo->prepare($sql)->execute([$name, $email, $hashedpassword]);

        
        $response->getBody()->write("User registerd successfully");
        return $response->withStatus(200);
    
            $pdo = null;
        } catch (\PDOException $e) {

        $response->getBody()->write("{$e->getMessage()}");
        return $response->withStatus(500);
           
        }
    
    });

    $group->post('/login',function(Request $request,Response $response){

        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
        
        $email = $requestData['email']; 
        $password = $requestData['password'];



        try {

            $db = new db();
           
            $pdo = $db->connect();

            $checkIfExists = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $checkIfExists->execute([$email]);

            if ($checkIfExists->rowCount()==0) {
               
                $response->getBody()->write("User not exits");
                return $response->withStatus(201);
            }
    
            $user = $checkIfExists->fetch(PDO::FETCH_ASSOC);
        
           
            if (password_verify($password, $user['password'])) {
                $payload = [
                    'email' => $email,
                ];
                $secretKey = $_ENV['secretKey'];
                
                $token = JWT::encode($payload, $secretKey, 'HS256');
                $response->getBody()->write($token);
                return $response->withStatus(200);
            } else {
                // Passwords do not match, return an error response
                $response->getBody()->write("Password is Incorrect");
                return $response->withStatus(201);
            }
        
                $pdo = null;
            } catch (\PDOException $e) {
                $response->getBody()->write("{$e->getMessage()}");
                return $response->withStatus(500);
            }
        

    });

    $group->get('/user',function(Request $request,Response $response){
        $token = $request->getAttribute('token');

        
        try {

            $decodedToken=$token;
            $db = new db();
            // connect
              $pdo = $db->connect();
           
                $email = $decodedToken->email;
                $User = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                
                $User->execute([$email]);
    
                $user = $User->fetch(PDO::FETCH_ASSOC);
                $id=$user['id'];
                $username=$user['name'];

                $pdo = null;
               
                $data = [
                    'id' => $id,
                    'username' => $username,
                ];

                $response->getBody()->write(json_encode($data));
                return $response->withStatus(200);
                    
        } catch (\Exception $e) {
            $response->getBody()->write("{$e->getMessage()}");
            return $response->withStatus(500);
        }

    })->add(new JwtMiddleware());

    $group->get('/likes',function(Request $request,Response $response){
        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
        
        $userId = $requestData['userId']; 

        try{
            $db = new db();
            // connect
            $pdo = $db->connect();
            $likeCountQuery = $pdo->prepare("
             SELECT COUNT(*) AS like_count FROM comments c INNER JOIN likes l ON c.id = l.commentId WHERE c.userId = userId");
            $likeCountQuery->execute(['userId' => $userId]);

        $likeCount = $likeCountQuery->fetch(PDO::FETCH_ASSOC)['like_count'];
        $response->getBody()->write($likeCount);
        return $response->withStatus(200);
        
        }catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        }
    })->add(new JwtMiddleware());
});

//This route is related to comments
$app->group('/api/comments',function(RouteCollectorProxy $group){   
   
    $group->get('/allcomments',function(Request $request,Response $response){
       
       
        $pageId = $request->getQueryParams()['pageId'] ?? null; 
       
    try {
        $db = new db();
        $pdo = $db->connect();
        $sql = "SELECT * FROM  comments WHERE pageId=?";
       
        $stmt = $pdo->prepare($sql);
       
        $stmt->execute([$pageId]); 
        error_log($pageId);
        $comments = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        
        $response->getBody()->write(json_encode($comments));
        return $response->withStatus(200);
    } catch (\PDOException $e) {

        $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
    }

    });


    $group->post('/add',function(Request $request,Response $response){
        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
       

        $body = $requestData['body']; 
        $username = $requestData['username']; 
        $userId = $requestData['userId'];
        $parentId=$requestData['parentId'];
        $createdAt=$requestData['createdAt'];
        $rootparentId=$requestData['rootparentId'];
        $pageId=$requestData['pageId'];
        $deleted=0;

        try {
            $db = new db();
            $pdo = $db->connect();
        $sql = "INSERT INTO comments (body,username ,userId,parentId,createdAt,rootparentId,pageId) VALUES (?,?,?,?,?,?,?)";
        
        $currentTime = new DateTime();
        
        $pdo->prepare($sql)->execute([$body, $username, $userId,$parentId,$createdAt,$rootparentId,$pageId]);
       
        $pdo = null;
        $response->getBody()->write("New comment created successfully");
        return $response->withStatus(200);
            
           
        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        }

        
    })->add(new JwtMiddleware());

   

    $group->put("/update", function(Request $request, Response $response) {
        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
    
        $id = $requestData['id'];
        $body = $requestData['body'];
        $deleted=$requestData['deleted'];
        try {
            $db = new db();
            $pdo = $db->connect();
            if($deleted){
                $sql = "UPDATE comments SET body = ?,deleted=? WHERE id = ?";
                $pdo->prepare($sql)->execute([$body,$deleted, $id]);
                
            }else{

                $sql = "UPDATE comments SET body = ? WHERE id = ?";
            $pdo->prepare($sql)->execute([$body, $id]);
            }
            
            $pdo = null;
    
            $response->getBody()->write("Comment Updated Successfully");
            return $response->withStatus(200);
        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
            return $response->withStatus(500);
        }
    })->add(new JwtMiddleware());
    

    $group->delete("/remove", function (Request $request, Response $response) {
        $requestData = json_decode($request->getBody()->getContents(), true);
    
        
            $id = $requestData['id'];
            error_log($id);
            try {
                $db = new db();
                $pdo = $db->connect();
                $sql = "DELETE FROM comments WHERE id=?";
               
                $pdo->prepare($sql)->execute([$id]);
               
                $pdo = null;
              
                $response->getBody()->write("Comment Deleted Successfully");
                return $response->withStatus(200);
            } catch (\PDOException $e) {
                $response->getBody()->write("{$e->getMessage()}");
                return $response->withStatus(500);
            }

    })->add(new JwtMiddleware());
    $group->get('/like_count',function(Request $request,Response $response){

        
       
        $commentId = $request->getQueryParams()['commentId'] ?? null;
    
        try{
            $db = new db();
            $pdo = $db->connect();
            
            $likeCountQuery = $pdo->prepare("SELECT COUNT(*) AS like_count FROM likes WHERE commentId=?");
            $likeCountQuery->execute([$commentId]);
            error_log("likes");

        $likeCount = $likeCountQuery->fetch(PDO::FETCH_ASSOC)['like_count'];
        error_log("likes");
        $response->getBody()->write(json_encode($likeCount));
        return $response->withStatus(200);
            

        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        };
    })->add(new JwtMiddleware());
   
    $group->post('/report',function(Request $request,Response $response){

        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
        $commentId=$requestData["id"];
        $userId=$requestData['userId'];

        try{
            $db = new db();
            $pdo = $db->connect();
            //Already exits so delete here commentId and userId combinded primary key
            $checkIfExists = $pdo->prepare("SELECT * FROM reports WHERE commentId = ? AND userId = ?");
            $checkIfExists->execute([$commentId, $userId]);
            if ($checkIfExists->rowCount() > 0) {
                
                $deleteExisting = $pdo->prepare("DELETE FROM reports WHERE commentId = ? AND userId = ?");
                
                $deleteExisting->execute([$commentId, $userId]);
            } else {
                
                $sql = "INSERT INTO reports (commentId, userId) VALUES (?, ?)";
                $pdo->prepare($sql)->execute([$commentId, $userId]);
            }
            
            $response->getBody()->write("Report Updated Seccessfully");
            return $response->withStatus(200);
            

        } catch (\PDOException $e) {
            
        $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        };
    })->add(new JwtMiddleware());

    $group->get('/report_count',function(Request $request,Response $response){

        $commentId = 1;
        $commentId = $request->getQueryParams()['commentId'];
       
        try{
            $db = new db();
            $pdo = $db->connect();
            
            $reportCountQuery = $pdo->prepare("SELECT COUNT(*) AS report_count FROM reports WHERE commentId=?");
           
            $reportCountQuery->execute([$commentId]);
           

        $reportCount = $reportCountQuery->fetch(PDO::FETCH_ASSOC)['report_count'];
    
        $response->getBody()->write(json_encode($reportCount));
        return $response->withStatus(200);
            

        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        };
    })->add(new JwtMiddleware());

    $group->get('/reported',function(Request $request,Response $response){

        $commentId = $request->getQueryParams()['commentId'] ?? null;
        $userId=$request->getQueryParams()['userId'] ?? null;
       
        try{
            $db = new db();
            $pdo = $db->connect();
            
            $checkIfExists = $pdo->prepare("SELECT * FROM reports WHERE commentId = ? AND userId = ?");
            $checkIfExists->execute([$commentId, $userId]);
            if ($checkIfExists->rowCount() > 0) {
                $response->getBody()->write(json_encode(1));
                return $response->withStatus(200);
            }else{

                $response->getBody()->write(json_encode(0));
                return $response->withStatus(200);
            }

        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        };
    })->add(new JwtMiddleware());    
});







//This route is related to likes
$app->group('/api/likes', function (RouteCollectorProxy $group)  {

    $group->post('/like',function(Request $request,Response $response){

        $requestBody = $request->getBody()->getContents();
        $requestData = json_decode($requestBody, true);
        $commentId=$requestData["id"];
        $userId=$requestData['userId'];
        error_log("likes");
        try{
            $db = new db();
            $pdo = $db->connect();
            
            $checkIfExists = $pdo->prepare("SELECT * FROM likes WHERE commentId = ? AND userId = ?");
            $checkIfExists->execute([$commentId, $userId]);
            if ($checkIfExists->rowCount() > 0) {
                
                $deleteExisting = $pdo->prepare("DELETE FROM likes WHERE commentId = ? AND userId = ?");
                
                $deleteExisting->execute([$commentId, $userId]);
            } else {

                $sql = "INSERT INTO likes (commentId, userId) VALUES (?, ?)";
                $pdo->prepare($sql)->execute([$commentId, $userId]);
            }
            
            $response->getBody()->write("Likes updated seccessfully");
            return $response->withStatus(200);
            

        } catch (\PDOException $e) {
            
            $response->getBody()->write("{$e->getMessage()}");
       return $response->withStatus(500);
        };
    })->add(new JwtMiddleware());




});
$app->run();