<!DOCTYPE HTML>
<html>
<head>
    <title>Adding Data to Tables</title>
</head>
<body>
<h1>Adding Data to Tables</h1>

<?php
    //My Console Log that outputs javascript
    function console_log($cStr)
    {
        echo '<script> console.log("PHP: ' . $cStr .'"); </script>';
    }

    // ======================================================================
    // Initialize MySQLi server connection parameters
    // ======================================================================
    $servername = "localhost";
    $username = "charneic_admin";
    $password = "mahdata@siteground";
    $dbName = "charneic_timeline";
    // $servername = "localhost";
    // $username = "root";
    // $password = "";
    // $dbName = "charneic_timeline";

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

    //Handles errors when Adding a record to the table
    function addRecordErr($vTable, $vSQL)
    {
        global $conn;

        $result = mysqli_query($conn, $vSQL);

        if(!$result)
            echo "<b>Can't add record to $vTable table: </b>" . mysqli_error($conn) . "<br />";
        else
            echo "<b>Record successfully added to $vTable table!</b><br />";
    }

    function addUser($vName, $vPass)
    {
        $name = $vName;
        $pass = $vPass;

        $sql = "INSERT INTO Users(Name, Password) VALUES('$name', '$pass')";
        addRecordErr("Users", $sql);
    }

    function addNovel($vUserID, $vNovelName, $vNovelDesc)
    {
        $uID = $vUserID;
        $nName = $vNovelName;
        $nDesc = $vNovelDesc;

        $sql = "INSERT INTO Novels(UserID, NovelName, NovelDescription) VALUES('$uID', '$nName', '$nDesc')";
        addRecordErr("Novels", $sql);
    }

    function addScene($vNovelID, $vSceneName, $vSceneText, $vEventID)
    {
        $nID = $vNovelID;
        $sName = $vSceneName;
        $sText = $vSceneText;
        $eID = $vEventID;

        if($eID)
            $sql = "INSERT INTO Scenes(NovelID, SceneName, SceneText, EventID) VALUES('$nID', '$sName', '$sText', '$eID')";
        else 
            $sql = "INSERT INTO Scenes(NovelID, SceneName, SceneText) VALUES('$nID', '$sName', '$sText')";
        
        addRecordErr("Scenes", $sql);
    }

    function addNote($vSceneID, $vNoteText)
    {
        $sID = $vSceneID;
        $nText = $vNoteText;

        $sql = "INSERT INTO Notes(SceneID, NoteText) VALUES('$sID', '$nText')";
        addRecordErr("Notes", $sql);
    }

    function addTimeline($vUserID, $vName)
    {
        $uID = $vUserID;
        $tName = $vName;

        $sql = "INSERT INTO Timelines(UserID, Name) VALUES('$uID', '$tName')";
        addRecordErr("Timelines", $sql);
    }

    function addYear($vTimelineID, $vName)
    {
        $tID = $vTimelineID;
        $yName = $vName;

        $sql = "INSERT INTO Years(TimelineID, Name) VALUES('$tID', '$yName')";
        addRecordErr("Years", $sql);
    }

    function addEvent($vYearID, $vName, $vSynposis)
    {
        $yID = $vYearID;
        $eName = $vName;
        $syn = $vSynposis;

        $sql = "INSERT INTO Events(YearID, Name, Synposis) VALUES('$yID', '$eName', '$syn')";
        addRecordErr("Events", $sql);
    }

    function addCharacter($vTimelineID, $vName)
    {
        $tID = $vTimelineID;
        $tName = $vName;

        $sql = "INSERT INTO Characters(TimelineID, Name) VALUES('$tID', '$tName')";
        addRecordErr("Characters", $sql);
    }

    addUser("Kaitlin", "password123");
    // $query = "SELECT UserID FROM Users WHERE Name='Kaitlin'";
    // $userID = mysqli_fetch_row($query);
    $userID = mysqli_insert_id($conn);
    addNovel($userID, "My Bio", "a bio of a novel");
    $novelID = mysqli_insert_id($conn);
    addScene($novelID, "Beginning", "This is the beginning", null);
    addScene($novelID, "Middle", "This is the middle", null);
    addScene($novelID, "End", "this is the end", null);
    addNovel($userID, "Tear", "Teardrops");
    $novelID = mysqli_insert_id($conn);
    addScene($novelID, "Drop", "teardop drop drop", null);
    addNovel($userID, "Yo", "this is the shit");
    $novelID = mysqli_insert_id($conn);
    addScene($novelID, "Ay", "hay hay ay", null);
    addScene($novelID, "Hay", "I said a ", null);
    addScene($novelID, "Microphone", "chekc one two", null);

    addUser("Tom", "tomtom");
    $userID = mysqli_insert_id($conn);
    addNovel($userID, "Toms World", "A world of toms");
    $novelID = mysqli_insert_id($conn);
    addScene($novelID, "World One", "a world of one", null);
    $sceneID = mysqli_insert_id($conn);
    addNote($sceneID, "Bobsssssss some note");
    addScene($novelID, "World Two", "a world of two", null);

    mysqli_close($conn);
?>

</body>
</html>