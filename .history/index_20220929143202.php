<!doctype html>
<html lang="en">
<head>
    <?php include './layout/header.html' ?>
</head>
<body>
<?php
require_once './layout/sidebar.html';

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
        case '/' :
        case '' :
        case '/home' :
            case '/login':
                case '/login/':
        require __DIR__.'/views/login-page/login.html';
        break;


        case '/orders':
        case '/orders/':
        require __DIR__.'/views/orders/orders.html';
        break;

        case '/dashboard':
        case '/dashboard/':
        require __DIR__.'/views/dashboard/dashboard.html';
        break;

   

        

        default:
        require __DIR__.'/views/login/login.html';
        break;
}
?>

 <?php require_once './layout/footer.html' ?>
</body>
</html>