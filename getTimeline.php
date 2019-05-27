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
    
    if($func == "getUser")
    {
        $userID = $_POST["uID"];
        $userResult = mysqli_query($conn, "SELECT * FROM Users WHERE UserID='$userID'");

        if(!mysqli_num_rows($userResult) == 0)
        {
            $uID = mysqli_fetch_array($userResult);
            $data["id"] = $uID["UserID"];
            $data["name"] = $uID["Name"];
        }
        else
        {
            $data["error"] = "User with ID $userID does not exist: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "getUsers")
    {
        $usersResult = mysqli_query($conn, "SELECT * FROM Users");
        if(!mysqli_num_rows($usersResult) == 0)
        {
            $iter = 0;
            while($row = mysqli_fetch_array($usersResult))
            {
                $user = array("id" => $row['UserID'], "name" => $row['Name']);
                $data["userArray"][$iter] = $user;
                $iter++;
            }
        }
        else
        {
            $data["error"] = "Failed to select Users table: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "getNovels")
    {
        $userID = $_POST["uID"];
        $novelsResult = mysqli_query($conn, "SELECT * FROM Novels WHERE UserID='$userID'");
        if(!mysqli_num_rows($novelsResult) == 0)
        {
            $iter = 0;
            while($row = mysqli_fetch_array($novelsResult))
            {
                $novel = array("id" => $row['NovelID'], "name" => $row['NovelName']);
                $data["novelArray"][$iter] = $novel;
                $iter++;
            }
        }
        else
        {
            $data["error"] = "Novel with UserID ID $userID does not exist: " . mysqli_error($conn); 
        }

        echo json_encode($data);
    }
    else if($func == "getTimeline")
    {
        $novelID = $_POST["nID"];
        $timelineResult = mysqli_query($conn, "SELECT * FROM Timelines WHERE NovelID='$novelID'");

        if(!mysqli_num_rows($timelineResult) == 0)
        {
            $tID = mysqli_fetch_array($timelineResult);
            $data["id"] = $tID["TimelineID"];
            $data["name"] = $tID["Name"];
        }
        else
        {
            $data["error"] = "Timeline with Novel ID $novelID does not exist: " . mysqli_error($conn);
        }

        echo json_encode($data);
    }
    else if($func == "getYears")
    {
        $timelineID = $_POST["tID"];

        $yearsResult = mysqli_query($conn, "SELECT * FROM Years WHERE TimelineID='$timelineID' ORDER BY Position");

        if(!mysqli_num_rows($yearsResult) == 0)
        {
            $iter = 0;
            while($row = mysqli_fetch_array($yearsResult))
            {
                $year = array("id" => $row['YearID'], "name" => $row['Name'], "pos" => $row['Position']);
                $data["yearArray"][$iter] = $year;
                $iter++;
            }
        }
        else
            $data["error"] = "Year with Timeline ID $timelineID does not exist: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "getEvents")
    {
        $yearID = $_POST["yID"];
        $eventsResult = mysqli_query($conn, "SELECT * FROM Events WHERE YearID='$yearID' ORDER BY Position");

        if(!mysqli_num_rows($eventsResult) == 0)
        {
            $iter = 0;
            while($row = mysqli_fetch_array($eventsResult))
            {
                $event = array("id" => $row['EventID'], "name" => $row['Name'], "syn" => $row['Synposis'], "pos" => $row['Position']);
                $data["eventArray"][$iter] = $event;
                $iter++;
            }
        }
        else
            $data["error"] = "Event with Year ID $yearID does not exist: " . mysqli_error($conn);

        echo json_encode($data);
    }
    else if($func == "getCharPovs")
    {
        $eventID = $_POST["eID"];
        $charpovResult = mysqli_query($conn, "SELECT * FROM CharacterPovs WHERE EventID='$eventID'");

        if(!mysqli_num_rows($charpovResult) == 0)
        {
            $iter = 0;
            while($row = mysqli_fetch_array($charpovResult))
            {
                $cpov = array("id" => $row['CharPovID'], "name" => $row['Name'], "pov" => $row['Pov'], "extra" => $row['Extra']);
                $data["charpovArray"][$iter] = $cpov;
                $iter++;
            }
        }
        else
            $data["error"] = "CharacterPov with Event ID $eventID does not exist: " . mysqli_error($conn);

        echo json_encode($data);
    }

    mysqli_close($conn);
?>