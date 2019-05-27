<?php
    include "db_credentials.php";
    // ======================================================================
    // Initialize MySQLi server connection parameters
    // ======================================================================
    $username = $my_username;
    $password = $my_password;
    $dbName = $my_dbName;

    $servername = $my_servername;

    // ======================================================================
    // Create connection with server
    // ======================================================================
    $conn = new mysqli($servername, $username, $password, $dbName);

    // ======================================================================
    // Check connection
    // ======================================================================
    if (!$conn)
    {
        die("Connection to Database $dbName failed: " . mysqli_connect_error() . "<br />");
    }

    $func = $_POST["getFunc"];
    $data = array();

    if($func == "deleteYear")
    {
        $yearID = $_POST["yID"];
    
        $deleteResult = mysqli_query($conn, "DELETE FROM Years WHERE YearID='$yearID'");

        if(!$deleteResult)
            $data["error"] =  "Can't delete Year $yearID from Years table: " . mysqli_error($conn);
        
        echo json_encode($data);  
    }
    else if($func == "deleteEvent")
    {
        $eventID = $_POST["eID"];

        $deleteResult = mysqli_query($conn, "DELETE FROM Events WHERE EventID='$eventID'");

        if(!$deleteResult)
            $data["error"] =  "Can't delete Event $eventID from Events table: " . mysqli_error($conn);
        
        echo json_encode($data);  
    }
    else if($func == "deleteCharPov")
    {
        $charPovID = $_POST["cPovID"];
        
        $deleteResult = mysqli_query($conn, "DELETE FROM CharacterPovs WHERE CharPovID='$charPovID'");

        if(!$deleteResult)
            $data["error"] =  "Can't delete CharacterPov $charPovID from CharacterPovs table: " . mysqli_error($conn);
        
        echo json_encode($data);
    }

    mysqli_close($conn);
?>