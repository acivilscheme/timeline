<?php
    //Start session
    session_start();

    $_SESSION["loggedIn"] = false;
    $_SESSION["username"] = "";
    $_SESSION["userID"] = "";

    session_destroy();

    echo json_encode("Logged out!");
?>