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
<script type="text/javascript">
    $(document).ready(function(){
        var noteAmt = 2;
        var userAmt = 1;
        var novelAmt = 1;
        var sceneAmt = 0;

        $("#id_addNote").click(function(){
            noteAmt += 1;
            $("#id_notesArea").append("<div class='c_notes mx-auto'>\
                                <label for='id_notesForm" + noteAmt + "'>Note " + noteAmt + "</label>\
                                <textarea class='form-control' id='id_notesForm"+ noteAmt + "'></textarea>\
                            </div>");
        });

        $("#id_userFormBtn").click(function(){
            userAmt += 1;
            $("#id_userForm").append("<option>User" + userAmt + "</option>");
        });

        $("#id_novelFormBtn").click(function(){
            novelAmt += 1;
            $("#id_novelForm").append("<option>Novel" + novelAmt + "</option>");
        });

        $("#id_sceneFormBtn").click(function(){
            sceneAmt += 1;
            $("#id_sceneForm").append("<option>Scene " + sceneAmt + "</option>");
        });
    });
</script>
</body>
</html>