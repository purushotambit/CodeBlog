<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Firebase\JWT\JWT;
use Slim\Psr7\Response as SlimResponse;

class JwtMiddleware
{
    public function __invoke(Request $request, RequestHandlerInterface $handler): Response
    {
        error_log("purush");
        $token = $this->getTokenFromHeader($request);
        if (!$token) {
            // If no token, return unauthorized response
            error_log("Kajal12");
            $response = new SlimResponse();
            $response = $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response;
        }
       
        try {
            // Replace 'your_secret_key' with your actual secret key
            $decodedToken = JWT::decode($token, 'your_secret_key', ['HS256']);
            $request = $request->withAttribute('token', $decodedToken);
        } catch (\Exception $e) {
            // If token decoding fails, return unauthorized response
            $response = new SlimResponse();
            $response = $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response;
        }

        // Continue with the next middleware or route handler
        return $handler->handle($request);
    }

    private function getTokenFromHeader(Request $request)
    {
        $header = $request->getHeaderLine('Authorization');
        $matches = [];
        // error_log($header);
        if (preg_match('/Bearer (.+)/', $header, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}
