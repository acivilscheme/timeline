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

    //Return text with no white space and apostrophe replaced
    function convertInput($userInput)
    {
        $userInput = trim($userInput);
        $userInput = str_replace("'", "''", $userInput);

        return $userInput;
    }

    $func = $_POST["getFunc"];
    $data = array();

    if($func == "saveTimeline")
    {
        $timelineName = $_POST["tName"];
        $timelineID = $_POST["tID"];
        
        $timelineName = convertInput($timelineName);

        $updateResult = mysqli_query($conn, "UPDATE Timelines SET Name='$timelineName' WHERE TimelineID='$timelineID'");

        if(!$updateResult)
            $data["error"] = "Can't update Name to Timeline table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveYear")
    {
        $yearName = $_POST["yName"];
        $yearID = $_POST["yID"];
        
        $yearName = convertInput($yearName);

        $updateResult = mysqli_query($conn, "UPDATE Years SET Name='$yearName' WHERE YearID='$yearID'");

        if(!$updateResult)
            $data["error"] = "Can't update Name to Years table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveYearsPosition")
    {
        $yearsOrder = $_POST["yOrder"];

        //Loop through year order array and update each year position in database
        foreach($yearsOrder as $key=>$value)
        {
            $pos = $key + 1; //starts from 0 unlike position so add 1
            $id = str_replace("year_", "", $value);
            
            $updateResult = mysqli_query($conn, "UPDATE Years SET Position='$pos' WHERE YearID='$id'");
            
            if(!$updateResult)
                $data["error"] = "Can't update Position to Years table: " . mysqli_error($conn);
        }
        
        echo json_encode($data);
    }
    else if($func == "saveEventName")
    {
        $eventName = $_POST["eName"];
        $eventID = $_POST["eID"];
        
        $eventName = convertInput($eventName);

        $updateResult = mysqli_query($conn, "UPDATE Events SET Name='$eventName' WHERE EventID='$eventID'");
        
        if(!$updateResult)
            $data["error"] = "Can't update Name to Events table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveEventSyn")
    {
        $eventSyn = $_POST["eSyn"];
        $eventID = $_POST["eID"];
        
        $eventSyn = convertInput($eventSyn);

        $updateResult = mysqli_query($conn, "UPDATE Events SET Synposis='$eventSyn' WHERE EventID='$eventID'");

        if(!$updateResult)
            $data["error"] = "Can't update Synposis to Events table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveEventsPosition")
    {
        $eventsOrder = $_POST["eOrder"];
        $yearID = $_POST["yID"];

        foreach($eventsOrder as $key=>$value)
        {
            $pos = $key + 1;
            $id = str_replace("event".$yearID."_", "", $value);

            $updateResult = mysqli_query($conn, "UPDATE Events SET Position='$pos' WHERE EventID='$id'");
            if(!$updateResult)
                $data["error"] = "Can't update Position to Events table: " . mysqli_error($conn);

        }

        echo json_encode($data);
    }
    else if($func == "saveCharName")
    {
        $charName = $_POST["cName"];
        $charPovID = $_POST["cPovID"];
        
        $charName = convertInput($charName);

        $updateResult =  mysqli_query($conn, "UPDATE CharacterPovs SET Name='$charName' WHERE CharPovID='$charPovID'");

        if(!$updateResult)
            $data["error"] .=  "Can't update Name to CharacterPovs table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveCharPov")
    {
        $charPov = $_POST["cPov"];
        $charPovID = $_POST["cPovID"];
        
        $charPov = convertInput($charPov);

        $updateResult = mysqli_query($conn, "UPDATE CharacterPovs SET Pov='$charPov' WHERE CharPovID='$charPovID'");

        if(!$updateResult)
            $data["error"] .= "Can't update Pov to CharacterPovs table: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "saveCharExtra")
    {
        $charExtra = $_POST["cExtra"];
        $charPovID = $_POST["cPovID"];
        
        $charExtra = convertInput($charExtra);

        $updateResult = mysqli_query($conn, "UPDATE CharacterPovs SET Extra='$charExtra' WHERE CharPovID='$charPovID'");

        if(!$updateResult)
            $data["error"] .= "Can't update Extra to CharacterPovs table: " . mysqli_error($conn);

        echo json_encode($data);
    }

    mysqli_close($conn);
?>