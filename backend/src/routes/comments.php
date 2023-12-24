<?php

use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;
use Slim\Factory\AppFactory;
// $app = new \Slim\App;
$app = AppFactory::create();
$app->group('/api/comments',function(RouteCollectorProxy $group){   
   
    $group->get('/allcomments',function(Request $request,Response $response){
       
       
        $pageId = $request->getQueryParams()['pageId'] ?? null; 
       
    try {
        $db = new db();
        $pdo = $db->connect();
        $sql = "SELECT * FROM  comments WHERE pageId=?";
        error_log($pageId);
        $stmt = $pdo->prepare($sql);
        error_log($pageId);
        $stmt->execute([$pageId]); 
        error_log($pageId);
        $comments = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        // var_dump($comments);
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
    
        // Use different variable names for clarity
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
            // Log the error for debugging purposes
            error_log("Database error: " . $e->getMessage());
    
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
        error_log($commentId);
        error_log("Purushotam");
        error_log("Kajal");
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
$app->run();