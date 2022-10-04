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
        require __DIR__.'/views/login-page/login.html';
        break;


        case '/orders':
        case '/orders/':
        require __DIR__.'/service.html';
        break;

        case '/dashboard':
        case '/dashboard/':
        require __DIR__.'/gallery.html';
        break;

   

        

        default:
        require __DIR__.'/404page.html';
        break;
}
?>

 <?php require_once './layout/footer.html' ?>
</body>
</html>