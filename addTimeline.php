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
    if(!$conn)
    {
        die("Connection to Database $dbName failed: " . mysqli_connect_error() . "<br />");
    }

    //Return text with no white space and apostrophe replaced
    function convertInput($userInput)
    {
        $userInput = trim($userInput);
        $userInput = str_replace("'", "''", $userInput);

        return $userInput;
    }

    $func = $_POST["getFunc"];
    $data = array();

    if($func == "addNovel")
    {
        $novelname = $_POST["nName"];
        $userID = $_POST["uID"];

        $novelname = convertInput($novelname);

        $addResult = mysqli_query($conn, "INSERT INTO Novels(UserID, NovelName) VALUES('$userID', '$novelname')");

        if($addResult)
        {
            $data["nID"] = mysqli_insert_id($conn);
        }
        else
        {
            $data["error"] = "Can't add $novelName to Novles table: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "addTimeline")
    {
        $timelineName = $_POST["tName"];
        $novelID = $_POST["nID"];
        
        $timelineName = convertInput($timelineName);

        $addResult = mysqli_query($conn,"INSERT INTO Timelines(Name, NovelID) VALUES('$timelineName', '$novelID')");

        if($addResult)
        {
            $data["tID"] = mysqli_insert_id($conn);
        }
        else
        {
            $data["error"] = "Can't add $timelineName to Timelines table: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "addYear")
    {
        $yearName = $_POST["yName"];
        $timelineID = $_POST["tID"];
        
        $yearName = convertInput($yearName);

        $addResult = mysqli_query($conn, "INSERT INTO Years(Name, TimelineID) VALUES('$yearName', '$timelineID')");

        if($addResult)
        {
            //Gets id from database, position is equal to id for now so it is at the end
            $data["yID"] = mysqli_insert_id($conn);
            $yearID = $data["yID"];
            mysqli_query($conn, "UPDATE Years SET Position='$yearID' WHERE YearID='$yearID'");
        }
        else
        {
            $data["error"] = "Can't add $yearName to Years table: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "addEvent")
    {
        $eventName = $_POST["eName"];
        $eventSyn = $_POST["eSyn"];
        $yearID = $_POST["yID"];
        
        $eventName = convertInput($eventName);
        $eventSyn = convertInput($eventSyn);

        $addResult = mysqli_query($conn, "INSERT INTO Events(Name, YearID, Synposis) VALUES('$eventName', '$yearID', '$eventSyn')");

        if($addResult)
        {
            $data["eID"] = mysqli_insert_id($conn);
            $eventID = $data["eID"];
            mysqli_query($conn, "UPDATE Events SET Position='$eventID' WHERE EventID='$eventID'");
        }
        else
            $data["error"] = "Can't add $eventName to Events table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "addCharPov")
    {
        $charName = $_POST["cName"];
        $charPov = $_POST["cPov"];
        $charExtra = $_POST["cExtra"];
        $eventID = $_POST["eID"];
        
        $charName = convertInput($charName);
        $charPov = convertInput($charPov);
        $charExtra = convertInput($charExtra);

        $addResult = mysqli_query($conn, "INSERT INTO CharacterPovs(Name, CharacterID, EventID, Pov, Extra) VALUES('$charName', '0', '$eventID', '$charPov', '$charExtra')");

        if($addResult)
        {
            $data["cpovID"] = mysqli_insert_id($conn);
        }
        else
            $data["error"] = "Can't add $charName to CharacterPovs table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    
    mysqli_close($conn);
?>