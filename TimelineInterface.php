<!DOCTYPE html>
<html lang="en">
<head>
    <title>Timeline Interface</title>

    <!-- [Bootstrap] Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- [Bootstrap] needs to be before other styles -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
    <style>
        .form-group.c_selectionBox{
            width: 150px;
            
        }
        select.form-control{
            min-width: 150px;
            min-height: 200px;
        }
        .c_myBtn{
            cursor: pointer;
        }
        #id_sceneTextArea{
            width: 500px;
            border: 0px solid pink;
        }
        #id_sceneTextForm{
            width: 100%;
            min-height: 350px;
        }
        #id_notesContainer{
            display: block;
            max-height: 350px;
            overflow: auto;
            border: 1px solid gray;
        }
        .c_notes{
            display: block;
            position: relative;
            width: 75%;
            min-height: 150px;
            border: 0px solid orange;
        }
        .c_notes textarea{
            min-height: 100px;
            max-height: 250px;
        }
        #id_addNote::hover{
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container-fluid text-center">
        <h1>Timeline Interface</h1>
        <h2>Bootstrap Version</h2>
    </div>

    <div class="container-fluid">
        <!-- Selection Form -->
        <div class="row justify-content-center" style="border: 0px solid red;">
            <div class="col-4" style="border: 0px solid pink">
                <form>
                    <div class="form-group c_selectionBox mx-auto">
                        <label for="id_userForm">Users</label>
                        <span type="button" id="id_userFormBtn" class="c_myBtn">
                            <i class="fas fa-plus-circle"></i>
                        </span>
                        <select class="form-control" id="id_userForm" size="4">
                            <!-- Filled in with scripting -->
                        </select>
                    </div>
                </form>
            </div>
            <div class="col-4" style="border: 0px solid pink">
                <form>
                    <div class="form-group c_selectionBox mx-auto">
                        <label for="id_novelForm">Novels</label>
                        <span type="button" id="id_novelFormBtn" class="c_myBtn">
                            <i class="fas fa-plus-circle"></i>
                        </span>
                        <select class="form-control" id="id_novelForm" size="4">
                            <!-- Filled in with scripting -->
                        </select>
                    </div>
                </form>
            </div>
            <div class="col-4" style="border: 0px solid pink">
                <form>
                    <div class="form-group c_selectionBox mx-auto">
                        <label for="id_sceneForm">Scenes</label>
                        <span type="button" id="id_sceneFormBtn" class="c_myBtn">
                            <i class="fas fa-plus-circle"></i>
                        </span>
                        <select class="form-control" id="id_sceneForm" size="4">
                            <!-- Filled in with scripting -->
                        </select>
                    </div>
                </form>
            </div>
        </div>

        <!-- Scene Text area -->
        <div class="row">
            <div class="col-8" style="border: 0px solid pink">
                <form>
                    <div class="form-group mx-auto" id="id_sceneTextArea">
                        <label for="id_sceneTextForm">Scene</label>
                        <textarea class="form-control" id="id_sceneTextForm"></textarea>
                    </div>
                </form>
            </div>
            <div class="col-4">
                <form>
                    <div class="form-group mx-auto">
                        <label for="id_notesContainer">Notes</label>
                        <div id="id_notesContainer" class="p-3">
                            <div id="id_notesArea">
                                <!-- Filled in with scripting -->
                            </div>
                            <div id="id_addNote">
                                <span>Add Note</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
<!-- [Bootstrap] javascript plugins, jquery and popper.js for bootstrap -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script src="TimelineInterface.js"></script>
<script>
$(document).ready(function(){
    var allUsers = [];

    //Creating objects with javascript
    // var uKaitlin = new User("Kaitlin", 0);
    // uKaitlin.addNovel("My Bio", 0);
    // uKaitlin.novels[0].addScene("Beginning", 0);
    // uKaitlin.novels[0].addScene("Middle", 1);
    // uKaitlin.novels[0].addScene("End", 2);
    // uKaitlin.addNovel("Tear", 1);
    // uKaitlin.novels[1].addScene("Drop", 0);
    // uKaitlin.addNovel("Yo", 2);
    // uKaitlin.novels[2].addScene("Ay", 0);
    // uKaitlin.novels[2].addScene("Hay", 1);
    // uKaitlin.novels[2].addScene("Microphone", 2);
    // allUsers.push(uKaitlin);
    
    // var uTom = new User("Tom", 1);
    // uTom.addNovel("Tom's World", 0);
    // uTom.novels[0].addScene("World One", 0);
    // uTom.novels[0].addScene("World Two", 1);
    // uTom.novels[0].scenes[0].addNote("Bob", 0);
    // allUsers.push(uTom);

    //When change user selection, add Novels
    $("#id_userForm").on("change", function(){
        var selectedUser = $(this).find("option:selected");
        // var selectedUsername = $(this).find("option:selected").val();
        var userID = selectedUser.attr("data-ID");
        // console.log("Item ID: " + itemID);

        allUsers[userID].removeNovelsUI();

        for(i in allUsers[userID].novels)
        {
            allUsers[userID].novels[i].addUI();
        }
    });

    //When change novel selection, add Scenes
    $("#id_novelForm").on("change", function(){
        var selectedNovel = $(this).find("option:selected");
        var novelID = selectedNovel.attr("data-ID");
        var userID = $("#id_userForm").find("option:selected").attr("data-ID");

        // console.log("Item ID: " + itemID);

        allUsers[userID].novels[novelID].removeScenesUI();

        for(i in allUsers[userID].novels[novelID].scenes)
        {
            allUsers[userID].novels[novelID].scenes[i].addUI();
        }
    });

    //When change scene selection, add Notes
    $("#id_sceneForm").on("change", function(){
        var selectedScene = $(this).find("option:selected");
        var sceneID = selectedScene.attr("data-ID");
        var novelID = $("#id_novelForm").find("option:selected").attr("data-ID");
        var userID = $("#id_userForm").find("option:selected").attr("data-ID");

        allUsers[userID].novels[novelID].scenes[sceneID].removeNotesUI();

        for(i in allUsers[userID].novels[novelID].scenes[sceneID].notes)
        {
            allUsers[userID].novels[novelID].scenes[sceneID].notes[i].addUI();
        }
    });

    <?php
        //Creating objects from database data
        $servername = "localhost";
        $username = "charneic_admin";
        $password = "mahdata@siteground";
        $dbName = "charneic_timeline";
        // $servername = "localhost";
        // $username = "root";
        // $password = "";
        // $dbName = "charneic_timeline";

        $conn = new mysqli($servername, $username, $password, $dbName);

        if (!$conn)
        {
            die("Connection to Database $dbName failed: " . mysqli_connect_error() . "<br />");
        }

        $usersInDatabase = mysqli_query($conn, "SELECT * FROM Users");
        if(!mysqli_num_rows($usersInDatabase) == 0)
        {
            while($row = mysqli_fetch_array($usersInDatabase))
            {
                echo "
                    var newUser = new User('".$row['Name']."', '".$row['UserID']."');
                    allUsers['".$row['UserID']."'] = newUser;
                ";
            }
        }

        $novelsInDatabase = mysqli_query($conn, "SELECT * FROM Novels");
        if(!mysqli_num_rows($novelsInDatabase) == 0)
        {
            while($row = mysqli_fetch_array($novelsInDatabase))
            {
                echo "
                    allUsers['".$row['UserID']."'].addNovel('".$row['NovelName']."', '".$row['NovelID']."');
            ";
            }
        }

        $scenesInDatabase = mysqli_query($conn, "SELECT * FROM Scenes");
        if(!mysqli_num_rows($scenesInDatabase) == 0)
        {
            while($row = mysqli_fetch_array($scenesInDatabase))
            {
                $result = mysqli_query($conn, "SELECT UserID FROM Novels WHERE NovelID='" . $row["NovelID"] . "' LIMIT 1");
                $uID = mysqli_fetch_array($result);
                $userID = $uID["UserID"];
                // console_log("UserID: ". $userID . "");
            
                echo "
                    allUsers['".$userID."'].novels['".$row['NovelID']."'].addScene('".$row['SceneName']."', '".$row['SceneID']."');
                ";
            }
        }

        $notesInDatabase = mysqli_query($conn, "SELECT * FROM Notes");
        if(!mysqli_num_rows($notesInDatabase) == 0)
        {
            while($row = mysqli_fetch_array($notesInDatabase))
            {
                $novelResult = mysqli_query($conn, "SELECT NovelID FROM Scenes WHERE SceneID='" . $row["SceneID"] . "' LIMIT 1");
                $nID = mysqli_fetch_array($novelResult);
                $novelID = $nID["NovelID"];

                $userResult = mysqli_query($conn, "SELECT UserID FROM Novels WHERE NovelID='".$novelID."' LIMIT 1");
                $uID = mysqli_fetch_array($userResult);
                $userID = $uID["UserID"];
        
                echo "
                    allUsers['".$userID."'].novels['".$novelID."'].scenes['".$row['SceneID']."'].addNote('".$row['NoteText']."', '".$row['SceneID']."');
                ";
            }
        }
    ?>
});
</script>
</body>
</html>
