<!DOCTYPE HTML>
<html>
<head>
    <title>Create Timeline Tables</title>
</head>
<body>
<h1>Creating Timeline Tables</h1>
<p>Probably will separate the creation of tables from the functions</p>
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

    //Handles errors when Creating a table
    function createTable($vTable, $vSQL)
    {
        global $conn;

        if(mysqli_query($conn, $vSQL))
            echo "<b>$vTable table created successfully!</b><br />";
        else
        echo "<b>Error creating $vTable table: </b>" . mysqli_error($conn) . "<br />";
    }

    //Creating Tables
    // UserID (auto)
	// Name (unique?)
	// password
    //Create Users table
    $sql = "CREATE TABLE Users(
        UserID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        Name VARCHAR(120) UNIQUE,
        Password VARCHAR(120)
    )";
    createTable("Users", $sql);

    // NovelID (auto)
	// UserID (foreign)
	// NovelName
	// NovelDescription
    //Create Novels table
    $sql = "CREATE TABLE Novels(
        NovelID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        UserID INT(11) NOT NULL,
        NovelName VARCHAR(120),
        NovelDescription VARCHAR(120)
    )";
    createTable("Novels", $sql);

    // 	SceneID (auto)
    // 	NovelID (foreign)
    // SceneText
    // EventID (foreign, optional)
    // Characters (fill from event ID or manually add)
    // 		Expans to show brief description and thoughts
    // 	Notes (fill from notes with same SceneID)
    //Create Scenes table
    $sql = "CREATE TABLE Scenes(
        SceneID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        NovelID INT(11) NOT NULL,
        SceneName VARCHAR(120) UNIQUE NOT NULL,
        SceneText TEXT,
        EventID INT(11)
    )";
    createTable("Scenes", $sql);

	// NotesID (auto)
	// SceneID (foreign)
    // NotesText (need to figure out how to attach to text)
    //Create Notes table
    $sql = "CREATE TABLE Notes(
        NoteID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        SceneID INT(11) NOT NULL,
        NoteText TEXT
    )";
    createTable("Notes", $sql);

    // TimelineID (auto)
    // UserID (foreign)
    // Name
    //Create Timelines table
    $sql = "CREATE TABLE Timelines(
        TimelineID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        UserID INT(11) NOT NULL,
        Name VARCHAR(120) UNIQUE
    )";
    createTable("Timelines", $sql);

	//YearID (auto)
	//TimelineID (foreign)
    //Year Name (unique?)
    //Create Years table
    $sql = "CREATE TABLE Years(
        YearID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        TimelineID INT(11) NOT NULL,
        Name VARCHAR(120) UNIQUE
    )";
    createTable("Years", $sql);

    // EventID (auto)
	// YearID (foreign)
	// Name/Title (unique)
    // Synposis
    //Create Events table
    $sql = "CREATE TABLE Events(
        EventID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        YearID INT(11) NOT NULL,
        Name VARCHAR(120) UNIQUE NOT NULL,
        Synposis TEXT
    )";
    createTable("Events", $sql);

    // CharacterID (auto)
	// TimelineID (foreign)
	// CharacterName (unique)
	// Picture
    //Create Characters table
    $sql = "CREATE TABLE Characters(
        CharacterID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        TimelineID INT(11) NOT NULL,
        Name VARCHAR(120) UNIQUE NOT NULL
    )";
    createTable("Characters", $sql);
    
    mysqli_close($conn);
?>

</body>
</html>