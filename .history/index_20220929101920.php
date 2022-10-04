<!doctype html>
<html lang="en">
<head>
    <?php include './layout/header.html' ?>
</head>
<body>
<?php
require_once './layout/navbar.html';

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
        case '/' :
        case '' :
        case '/home' :
        require __DIR__.'/index.html';
        break;


        case '/service':
        case '/service/':
        require __DIR__.'/service.html';
        break;

        case '/gallery':
        case '/gallery/':
        require __DIR__.'/gallery.html';
        break;

        case '/contact':
        case '/contact/':
        require __DIR__.'/contact.html';
        break;

        case '/appointment':
        case '/appointment/':
        require __DIR__.'/appointment.html';
        break;

        

        default:
        require __DIR__.'/404page.html';
        break;
}
?>

 <?php require_once './layout/footer.html' ?>
</body>
</html>