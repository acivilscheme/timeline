
$(document).ready(function(){
    //Array that holds data from database. Used to structure the data into parents and children and store IDs
    var allUsers = [];
 
    // Get user by id
    $.ajax({
        url: "getTimeline.php",
        method: "POST",
        data: {"getFunc": "getUser", uID: "3"},
        dataType: "json",
        success: function(response){
            if(!response.error)
            {
                var userName = response.name;
                var userID =  response.id;

                var newUser = new User(userName, userID);
                allUsers[userID] = newUser;

                //Storing UserID from response
                $("#id_timelineWrap").data("userID", userID);
                //Add name to UI
                $("#id_userName").text("Welcome, " + userName);

                //Display Add Timeline button
                $("#id_addTimeline").css("display", "flex");

                //Get novels from database
                $.ajax({
                    url: "getTimeline.php",
                    method: "POST",
                    data: {"getFunc": "getNovels", uID: $("#id_timelineWrap").data("userID")},
                    dataType: "json",
                    success: function(response){
                        if(!response.error)
                        {
                            for(i in response.novelArray)
                            {
                                allUsers[userID].addNovel(response.novelArray[i].name, response.novelArray[i].id);
                            }
                        }
                    }
                });

            }
        }
    });

    //---------------------------------------------------------------
    //GET FUNCTIONS
    //---------------------------------------------------------------
    //When change novel selection, get Timeline and add to UI if exist and remove old
    $("#id_novelSelect").on("change", function(){
        //Remove timeline elements from container
        $(".c_year").remove();
        //Remove characters from selection box
        $("#id_characters").empty().append("<option selected>All Characters...</option>");

        var userID = $("#id_timelineWrap").data("userID");
        var novelID = $("#id_novelSelect").find("option:selected").attr("data-id");
        $("#id_timelineWrap").data("novelID", novelID);
        
        //If novel not selected, hide, else show timelineUI
        if(novelID == undefined)
        {
            //If no novel selected, hide timeline and addtimeline button
            $("#id_addTimeline").css("display", "flex");
            hideTimelineUI();
        }
        else
        {
            //If timeline doesnt exist, getTimeline call, else show from javascript
            if(!allUsers[userID].novels[novelID].timeline)
            {
                ajax_getTimeline(allUsers, userID, novelID);
                
            }
            else
            {
                allUsers[userID].novels[novelID].timeline.timelineCharacters = [];
                
                for(i in allUsers[userID].novels[novelID].timeline.yearsOrder)
                {
                    var yearID = allUsers[userID].novels[novelID].timeline.yearsOrder[i];
                    yearID = yearID.replace("year_", "");

                    var tempYear = allUsers[userID].novels[novelID].timeline.years[yearID];
                    allUsers[userID].novels[novelID].timeline.appendYearUI(tempYear.name, tempYear.ID);

                    for(j in allUsers[userID].novels[novelID].timeline.years[yearID].events)
                    {
                        var tempEvent = allUsers[userID].novels[novelID].timeline.years[yearID].events[j];
                        tempYear.appendEventUI(yearID, j, tempEvent.name, tempEvent.synopsis);

                        for(k in allUsers[userID].novels[novelID].timeline.years[yearID].events[j].characters)
                        {
                            var tempChar = allUsers[userID].novels[novelID].timeline.years[yearID].events[j].characters[k];
                            tempEvent.appendCharacterUI(yearID, j, tempChar.ID, tempChar.name, tempChar.pov, tempChar.extra);
                            allUsers[userID].novels[novelID].timeline.addCharsToSelectBox(tempChar.name);
                       }
                    }
                }

                showTimelineUI(allUsers[userID].novels[novelID].timeline.name, allUsers[userID].novels[novelID].timeline.ID);
                $("#id_addTimeline").css("display", "none");
            }
        }
    });

    //---------------------------------------------------------------
    //ADDING FUNCTIONS
    //---------------------------------------------------------------
    //Add Timeline form: Change modal to timeline ui
    $("#id_addTimelineBtn").on("click", function(){
        var novelID = $("#id_novelSelect").find("option:selected").attr("data-id");

        $("#id_modalForm .modal-title").text("Add Timeline");
        $("#id_modalForm .modal-body").empty();

        //If no novel is selected, add add novel input to form
        if(novelID == undefined)
            $("#id_modalForm .modal-body").append("<label for='id_fNovelName'>Novel Name:</label>\
                <input class='form-control' id='id_fNovelName' />");

        $("#id_modalForm .modal-body").append("<label for='id_ftimelineName'>Timeline Name:</label>\
            <input class='form-control' id='id_ftimelineName' />");
        $("#id_modalForm .modal-footer").empty().append("<button type='button' class='btn' id='id_addTimelineForm' data-dismiss='modal'>Add</button>\
            <button type='button' class='btn' data-dismiss='modal'>Close</button>");
    });

    //Add Timeline to database and javascript and show timeline
    $(document.body).on("click", "#id_addTimelineForm", function(){

        //If Novel is not selected, add inputted novel and timeline to database
        if($("#id_novelSelect").find("option:selected").attr("data-id") == undefined)
        {
            var userID = $("#id_timelineWrap").data("userID");
            var novelName = $("#id_fNovelName").val();
            var timelineName = $("#id_ftimelineName").val();

            $.ajax({
                url: "addTimeline.php",
                method: "POST",
                data: {"getFunc": "addNovel", nName: novelName, uID: userID},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        novelName = convertInput(novelName);
                        var novelID = response.nID;

                        allUsers[userID].addNovel(novelName, novelID);

                        $.ajax({
                            url: "addTimeline.php",
                            method: "POST",
                            data: {"getFunc": "addTimeline", tName: timelineName, nID: novelID},
                            dataType: "json",
                            success: function(response){
                                if(!response.error)
                                {
                                    timelineName = convertInput(timelineName);
            
                                    $("#id_addTimeline").css("display", "none");
                                    allUsers[userID].novels[novelID].addTimeline(timelineName, response.tID);
                                    $("#id_novelSelect").val(novelName);
                                    showTimelineUI(timelineName, response.tID);
                                }
                            }
                        });
                    }
                }
            });
        }//Else just add timeline
        else
        {
            var novelID = $("#id_timelineWrap").data("novelID");
            var timelineName = $("#id_ftimelineName").val();

            $.ajax({
                url: "addTimeline.php",
                method: "POST",
                data: {"getFunc": "addTimeline", tName: timelineName, nID: novelID},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");

                        timelineName = convertInput(timelineName);

                        $("#id_addTimeline").css("display", "none");
                        allUsers[userID].novels[novelID].addTimeline(timelineName, response.tID);
                        showTimelineUI(timelineName, response.tID);
                    }
                    else
                    {
                        console.log("RESPONSE addTimeline: " + response.error);
                    }   
                }
            });
        }
    });

    //Add Year form: Change modal to year ui
    $(document.body).on("click", "#id_addYearBtn", function(){
        $("#id_modalForm .modal-title").text("Add Year");
        $("#id_modalForm .modal-body").empty().append("<label for='id_fyearName'>Year Name:</label>\
            <input class='form-control' id='id_fyearName' />");
        $("#id_modalForm .modal-footer").empty().append("<button type='button' class='btn' id='id_addYearForm' data-dismiss='modal'>Add</button>\
            <button type='button' class='btn' data-dismiss='modal'>Close</button>");
    });

    //Add Year to database and in javascript
    $(document.body).on("click", "#id_addYearForm", function(){
        var timelineID = $("#id_timelineName").attr("data-id");
        var yearName = $("#id_fyearName").val();

        $.ajax({
            url: "addTimeline.php",
            method: "POST",
            data: {"getFunc": "addYear", tID: timelineID, yName: yearName},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");

                    //remove whitespace from sides
                    yearName = convertInput(yearName);

                    allUsers[userID].novels[novelID].timeline.addYear(yearName, response.yID);
                }
            }
        });
    });

    //Add Event form: Change modal to event ui
    $("#id_yearsWrap").on("click", ".c_addEventBtn", function(){
        var yearID = $(this).parents(".c_year").attr("data-id");
        
        $("#id_modalForm .modal-title").text("Add Event");
        $("#id_modalForm .modal-body").empty().append("<label for='id_feventName'>Event Name:</label>\
            <input class='form-control' id='id_feventName' data-id='"+yearID+"'/>\
            <label for='id_feventSynp'>Synposis:</label>\
            <textarea class='form-control' id='id_feventSynp'></textarea>");
        $("#id_modalForm .modal-footer").empty().append("<button type='button' class='btn' id='id_addEventForm' data-dismiss='modal'>Add</button>\
            <button type='button' class='btn' data-dismiss='modal'>Close</button>");
    });

    //Add Event to database and add in javascript
    $(document.body).on("click", "#id_addEventForm", function(){
        var yearID = $("#id_feventName").attr("data-id");
        var eventName = $("#id_feventName").val();
        var eventSyn = $("#id_feventSynp").val();

        $.ajax({
            url: "addTimeline.php",
            method: "POST",
            data: {"getFunc": "addEvent", yID: yearID, eName: eventName, eSyn: eventSyn},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");

                    eventName = convertInput(eventName);
                    eventSyn = convertInput(eventSyn);

                    allUsers[userID].novels[novelID].timeline.years[yearID].addEvent(eventName, response.eID, eventSyn);
                }
            }
        });
    });
   
    //Add CharacterPov form: Change modal to characterpov ui
    $("#id_yearsWrap").on("click", ".c_addChar", function(){
        var yearID = $(this).parents(".c_year").attr("data-id");
        var eventID = $(this).parents(".c_event").attr("data-id");

        $("#id_modalForm .modal-title").text("Add Character");

        $("#id_modalForm .modal-body").empty().append("<label for='id_fcharName'>Character's Name:</label>\
            <input class='form-control' id='id_fcharName' data-idy='"+yearID+"' data-ide='"+eventID+"'/>\
            <label for='id_fcharPov'>Point of View:</label>\
            <textarea class='form-control' id='id_fcharPov' autocomplete='off'></textarea>\
            <label for='id_fcharExtra'>Extra (50 characters min):</label>\
            <input class='form-control' id='id_fcharExtra' /> ");
        $("#id_modalForm .modal-footer").empty().append("<button type='submit' class='btn' id='id_addCharPovForm' data-dismiss='modal'>Add</button>\
            <button type='button' class='btn' data-dismiss='modal'>Close</button>");
    });

    //Add Characterpov to database and to javascript
    $(document.body).on("click", "#id_addCharPovForm", function(){
        //when add, insert into database, query for id then add to interface
        var eventID = $("#id_fcharName").attr("data-ide");
        var charName = $("#id_fcharName").val();
        var charPov = $("#id_fcharPov").val();
        var charExtra = $("#id_fcharExtra").val();

        $.ajax({
            url: "addTimeline.php",
            method: "POST",
            data: {"getFunc": "addCharPov", eID: eventID, cName: charName, cPov: charPov, cExtra: charExtra},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");
                    var yearID = $("#id_fcharName").attr("data-idy");
                    
                    charName = convertInput(charName);
                    charPov = convertInput(charPov);
                    charExtra = convertInput(charExtra);

                    allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].addCharacter(charName, response.cpovID, charPov, charExtra, yearID);
                    allUsers[userID].novels[novelID].timeline.addCharsToSelectBox(charName);

                    //when add charpov, make it open the edit char modal when clicked
                    $(".c_charspov[data-id='"+response.cpovID+"']").prop("disabled", false);
                    $(".c_charspov[data-id='"+response.cpovID+"']").popover("disable");
                    $(".c_charspov[data-id='"+response.cpovID+"']").addClass("c_editable");
                    $(".c_charspov[data-id='"+response.cpovID+"']").attr("data-toggle", "modal");
                    $(".c_charspov[data-id='"+response.cpovID+"']").attr("data-target", "#id_modalForm");
                }
            }
        });
    });

    //---------------------------------------------------------------
    //OTHER Functions
    //---------------------------------------------------------------
    //For each element that has this attribute, make it a popover
    $("[data-toggle='popover']").each(function () {
        $(this).popover();
    });

    //---------------------------------------------------------------
    //EDIT AND SAVING FUNCTIONS
    //---------------------------------------------------------------
    //Show year edit and delete icons when hover over year
    $("#id_yearsWrap").on("mouseenter", ".c_yearNameWrap", function(){
        $(this).children(".c_editIcons").stop().fadeTo("fast", 1);}).on("mouseleave", ".c_yearNameWrap", 
        function(){$(this).children(".c_editIcons").stop().fadeTo("fast", 0);
    });

    //Show event edit and delete icons when hover over event
    $("#id_yearsWrap").on("mouseenter", ".c_event", function(){
        $(this).children(".c_editIcons").stop().fadeTo("fast", 1);}).on("mouseleave", ".c_event", 
        function(){$(this).children(".c_editIcons").stop().fadeTo("fast", 0);
    });

    //When collapse event, hide edit button
    $("#id_yearsWrap").on("hide.bs.collapse", ".c_event", function(){
        $(this).find(".c_editbtn").hide();
    });
    //When show event, show edit button
    $("#id_yearsWrap").on("show.bs.collapse", ".c_event", function(){
        $(this).find(".c_editbtn").show();
    });
    
    //When click edit button, make event editable. If save button, save changes
    //Save Event Name and synposis included here
    $(document.body).on("click", ".c_editbtn", function(){
        //If icon edit, make things editable
        if($(this).hasClass("fa-edit"))
        { 
            //Check if parent is an event
            if($(this).parents(".c_event").length)
            {
                //If other events are in edit mode, click to save them
                $(".c_editbtn.fa-save").click();

                //Change Icon to save icon
                $(this).removeClass("fa-edit").addClass("fa-save");

                var eventCard = $(this).parent().next(".card");

                //Disable event button and make editable
                eventCard.find(".c_eventNameWrap").attr("data-toggle", "");
                eventCard.find(".c_eventName").prop("disabled", false);
                //Make Synposis editable
                eventCard.find(".card-text").prop("disabled", false);
                //Show add character button
                eventCard.find(".c_addChar").show();
                //Disable popovers and make open modal to edit characters
                //For disabled buttons, enable them
                eventCard.find(".c_disabled").prop("disabled", false);
                eventCard.find(".c_charspov").each(function () {
                    $(this).popover("disable");
                    $(this).addClass("c_editable");
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#id_modalForm");
                });
            }//check if parent is a year and bring up modal
            else if($(this).parents(".c_yearNameWrap").length)
            {
                var yearID = $(this).parents(".c_year").attr("data-id");
                var yearName = $(this).parent().next(".c_yearName").text();

                $("#id_modalForm .modal-title").text("Edit Year");
                
                $("#id_modalForm .modal-body").empty().append("<label for='id_fyearName'>Name:</label>\
                <input class='form-control' id='id_fyearName' data-id='"+yearID+"' value='"+yearName+"'/>");
        
                $("#id_modalForm .modal-footer").empty().append("<button type='submit' class='btn' id='id_saveYearForm' data-dismiss='modal'>Save</button>\
                <button type='button' class='btn' data-dismiss='modal'>Close</button>");

                $("#id_modalForm").modal("show");
            }
        }//If icon not edit, disable editing and save changes
        else
        {
            //Change icon to edit icon
            $(this).removeClass("fa-save").addClass("fa-edit");

            //Disable editing if an event
            if($(this).parents(".c_event").length)
            {
                var eventCard = $(this).parent().next(".card");

                eventCard.find(".c_eventNameWrap").attr("data-toggle", "collapse");
                eventCard.find(".c_eventName").prop("disabled", true);
                eventCard.find(".card-text").prop("disabled", true);
                eventCard.find(".c_addChar").hide();
                //if has class disabled, make disabled. Used for charpov
                eventCard.find(".c_disabled").prop("disabled", true);
                eventCard.find(".c_charspov.c_editable").each(function () {
                    $(this).removeClass("c_editable");
                    $(this).attr("data-toggle", "popover");
                    $(this).attr("data-target", "");
                    $(this).popover("enable");
                });
            }

            //When click save, check to see what has changed and save it
            $(this).parent().next(".card").find(".c_changed").each(function(){
                //Save Event Name if has changed
                if($(this).hasClass("c_eventName"))
                {
                    var event = $(this);
                    var eventID = event.parents(".c_event").attr("data-id");
                    var eventName = event.val();
                    
                    $.ajax({
                        url: "saveTimeline.php",
                        method: "POST",
                        data: {"getFunc": "saveEventName", eID: eventID, eName: eventName},
                        dataType: "json",
                        success: function(response){
                            if(!response.error)
                            {
                                var userID = $("#id_timelineWrap").data("userID");
                                var novelID = $("#id_timelineWrap").data("novelID");
                                var yearID = event.parents(".c_year").attr("data-id");
        
                                allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].name = convertInput(eventName);
                            }
                        }
                    });
                }//Save Event Synposis if has changed
                else if($(this).hasClass("c_synposis"))
                {
                    var event = $(this);
                    var eventID = event.parents(".c_event").attr("data-id");
                    var eventSyn = event.val();

                    $.ajax({
                        url: "saveTimeline.php",
                        method: "POST",
                        data: {"getFunc": "saveEventSyn", eID: eventID, eSyn: eventSyn},
                        dataType: "json",
                        success: function(response){
                            if(!response.error)
                            {
                                var userID = $("#id_timelineWrap").data("userID");
                                var novelID = $("#id_timelineWrap").data("novelID");
                                var yearID = event.parents(".c_year").attr("data-id");

                                allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].synopsis = convertInput(eventSyn);

                            }
                        }
                    });
                }
            });
        }  
    });
 
    //Save Year when user clicks save button on form
    $(document.body).on("click", "#id_saveYearForm", function(){
        var yearName = $("#id_fyearName").val();
        var yearID = $("#id_fyearName").attr("data-id");
        
        $.ajax({
            url: "saveTimeline.php",
            method: "POST",
            data: {"getFunc": "saveYear", yID: yearID, yName: yearName},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");

                    //Add new name to javascript and change the text
                    allUsers[userID].novels[novelID].timeline.years[yearID].name = convertInput(yearName);
                    $(".c_year[data-id='"+yearID+"']").find(".c_yearName").text(convertInput(yearName));
                }
            }
        });
    });

    //When characterpov in event is editable, bring up modal
    $(document.body).on("click", ".c_charspov.c_editable", function(){
        var yearID = $(this).parents(".c_year").attr("data-id");
        var eventID = $(this).parents(".c_event").attr("data-id");
        var charName = convertInput($(this).text());
        var charPov = convertInput($(this).attr("data-content"));
        var charExtra = convertInput($(this).attr("data-original-title"));
        var charPovID = $(this).attr("data-id");

        $("#id_modalForm .modal-title").text("Edit Character");

        $("#id_modalForm .modal-body").empty().append("<label for='id_fcharName'>Name:</label>\
            <input class='form-control' id='id_fcharName' data-idy='"+yearID+"' data-ide='"+eventID+"' data-id='"+charPovID+"' value='"+charName+"'/>\
            <label for='id_fcharPov'>Point of View:</label>\
            <textarea class='form-control' id='id_fcharPov' autocomplete='off'>"+charPov+"</textarea>\
            <label for='id_fcharExtra'>Extra (50 characters min):</label>\
            <input class='form-control' id='id_fcharExtra' value='"+charExtra+"' />");
        $("#id_modalForm .modal-footer").empty().append("<i class='fas fa-trash-alt mr-auto c_deletebtn'></i>\
            <button type='submit' class='btn' id='id_saveCharPovForm' data-dismiss='modal'>Save</button>\
            <button type='button' class='btn' data-dismiss='modal'>Close</button>");
    });

    //Check what has changed with characterpov so save only that
    $(document.body).on("input", "#id_fcharName", function(){
        if(!$(this).hasClass("c_changed"))
            $(this).addClass("c_changed");
    });
    $(document.body).on("input", "#id_fcharPov", function(){
        if(!$(this).hasClass("c_changed"))
            $(this).addClass("c_changed");
    });
    $(document.body).on("input", "#id_fcharExtra", function(){
        if(!$(this).hasClass("c_changed"))
            $(this).addClass("c_changed");
    });

    //Save character pov when user clicks save button on form
    $(document.body).on("click", "#id_saveCharPovForm", function(){
        //Need to check what has been changed and call appropriate function
        var charPovID = $("#id_fcharName").attr("data-id");
        var charPovObj = $(".c_charspov[data-id='"+charPovID+"']");

        //If charpov does not have a pov and extra and it is not disabled, make button disabled
        if(!$("#id_fcharPov").val() && !$("#id_fcharExtra").val() && !charPovObj.hasClass("c_disabled"))
        {
            charPovObj.addClass("c_disabled");
        }
        else if($("#id_fcharPov").val() || $("#id_fcharExtra").val() && charPovObj.hasClass("c_disabled"))
        {
            charPovObj.removeClass("c_disabled");
        }

        if($("#id_fcharName").hasClass("c_changed"))
        {
            $("#id_fcharName").removeClass("c_changed");
            var charName = $("#id_fcharName").val();

            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveCharName", cPovID: charPovID, cName: charName},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");
                        var yearID = $("#id_fcharName").attr("data-idy");
                        var eventID = $("#id_fcharName").attr("data-ide");
    
                        allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters[charPovID].name = convertInput(charName);
                        charPovObj.html(convertInput(charName));
                    }
                }
            });
        }
        
        if($("#id_fcharPov").hasClass("c_changed"))
        {
            $("#id_fcharPov").removeClass("c_changed");
            var charPov = $("#id_fcharPov").val();

            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveCharPov", cPovID: charPovID, cPov: charPov},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");
                        var yearID = $("#id_fcharName").attr("data-idy");
                        var eventID = $("#id_fcharName").attr("data-ide");
    
                        allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters[charPovID].pov = convertInput(charPov);
                        charPovObj.attr("data-content", charPov);
                        charPovObj.data("bs.popover").config.content = charPov;
                    }
                }
            });
        }
        
        if($("#id_fcharExtra").hasClass("c_changed"))
        {
            $("#id_fcharExtra").removeClass("c_changed");
            var charExtra = $("#id_fcharExtra").val();

            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveCharExtra", cPovID: charPovID, cExtra: charExtra},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");
                        var yearID = $("#id_fcharName").attr("data-idy");
                        var eventID = $("#id_fcharName").attr("data-ide");
    
                        allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters[charPovID].extra = convertInput(charExtra);
                        charPovObj.attr("data-original-title", charExtra);
                        charPovObj.data("bs.popover").config.title = charExtra;
                    }
                }
            });
        }
    });

    //Timeout saving
    //When type in timeline name, save text
    var saveTimelineName = "";
    $(document.body).on("input", "#id_timelineName", function(){
        var eventObj = $(this);

        if(saveTimelineName)
            clearTimeout(saveTimelineName);
        saveTimelineName = setTimeout(function(){
            var timelineID = $("#id_timelineName").attr("data-id");
            var timelineName = eventObj.val();

            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveTimeline", tID: timelineID, tName: timelineName},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");

                        allUsers[userID].novels[novelID].timeline.name = convertInput(timelineName);
                    }
                }
            });
        }, 3000);
    });

    //When type in event input, save text
    var saveEventName = "";
    $(document.body).on("input", ".c_eventName", function(){
        if(!$(this).hasClass("c_changed"))
            $(this).addClass("c_changed");

        var eventObj = $(this);

        if(saveEventName)
            clearTimeout(saveEventName);
        saveEventName = setTimeout(function(){
            eventObj.removeClass("c_changed");
            var eventID = eventObj.parents(".c_event").attr("data-id");
            var eventName = eventObj.val();
            
            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveEventName", eID: eventID, eName: eventName},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");
                        var yearID = eventObj.parents(".c_year").attr("data-id");

                        allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].name = convertInput(eventName);
                    }
                }
            });
        }, 3000);
    });

    //when type in event synposis, save
    var saveEventSynposis = "";
    $(document.body).on("input", ".c_synposis", function(){
        if(!$(this).hasClass("c_changed"))
            $(this).addClass("c_changed");

        var eventObj = $(this);

        if(saveEventSynposis)
            clearTimeout(saveEventSynposis);
        saveEventSynposis = setTimeout(function(){
            eventObj.removeClass("c_changed");
            var eventID = eventObj.parents(".c_event").attr("data-id");
            var eventSyn = eventObj.val();

            $.ajax({
                url: "saveTimeline.php",
                method: "POST",
                data: {"getFunc": "saveEventSyn", eID: eventID, eSyn: eventSyn},
                dataType: "json",
                success: function(response){
                    if(!response.error)
                    {
                        var userID = $("#id_timelineWrap").data("userID");
                        var novelID = $("#id_timelineWrap").data("novelID");
                        var yearID = eventObj.parents(".c_year").attr("data-id");

                        allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].synopsis = convertInput(eventSyn);
                    }
                }
            });
        }, 3000);
    });

    //---------------------------------------------------------------
    //DELETE FUNCTIONS
    //---------------------------------------------------------------
    //Asks if user is sure if want to delete year, event, or charpov
    $(document.body).on("click", ".c_deletebtn", function(){
        if($(this).parents(".c_yearNameWrap").length)
        {
            var yearID = $(this).parents(".c_year").attr("data-id");
            var yearName = $(this).parent().next(".c_yearName").text();

            $("#id_modalForm .modal-title").text("Delete Year");

            $("#id_modalForm .modal-body").empty().append("<p id='id_fyearName' data-id='"+yearID+"'>Are you sure you want to delete Year '"+yearName+"'?");

            $("#id_modalForm .modal-footer").empty().append("<button type='submit' class='btn' id='id_deleteYearForm' data-dismiss='modal'>Delete</button>\
                <button type='button' class='btn' data-dismiss='modal'>Cancel</button>");

            $("#id_modalForm").modal("show");
        }
        else if($(this).parents(".c_event").length)
        {
            var yearID = $(this).parents(".c_year").attr("data-id");
            var eventID = $(this).parents(".c_event").attr("data-id");
            var eventName = $(this).parent().next(".card").find(".c_eventName").val();

            $("#id_modalForm .modal-title").text("Delete Event");

            $("#id_modalForm .modal-body").empty().append("<p id='id_feventName' data-id='"+eventID+"' data-idy='"+yearID+"'>Are you sure you want to delete Event '"+eventName+"'?");

            $("#id_modalForm .modal-footer").empty().append("<button type='submit' class='btn' id='id_deleteEventForm' data-dismiss='modal'>Delete</button>\
                <button type='button' class='btn' data-dismiss='modal'>Cancel</button>");

            $("#id_modalForm").modal("show");
        }
        else if($(this).siblings("#id_saveCharPovForm").length)
        {
            $("#id_modalForm").modal("hide");

            $("#id_modalForm").one("hidden.bs.modal", function(e){
                var yearID = $("#id_fcharName").attr("data-idy");
                var eventID = $("#id_fcharName").attr("data-ide");
                var charPovID = $("#id_fcharName").attr("data-id");
                var charName = $("#id_fcharName").val();

                $("#id_modalForm .modal-title").text("Delete Character pov");
                
                $("#id_modalForm .modal-body").empty().append("<p id='id_fcharName' data-id='"+charPovID+"' data-idy='"+yearID+"' data-ide='"+eventID+"'>Are you sure you want to delete Character Pov '"+charName+"'?");

                $("#id_modalForm .modal-footer").empty().append("<button type='submit' class='btn' id='id_deleteCharPovForm' data-dismiss='modal'>Delete</button>\
                    <button type='button' class='btn' id='id_cancelDeleteCharPov'>Cancel</button>");

                $("#id_modalForm").modal("show");
            });
        }
    });

    //Delete Year on delete confirmation
    $(document.body).on("click", "#id_deleteYearForm", function(){
        var yearID = $("#id_fyearName").attr("data-id");

        $.ajax({
            url: "deleteTimeline.php",
            method: "POST",
            data: {"getFunc": "deleteYear", yID: yearID},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");

                    $(".c_year[data-id='"+yearID+"']").remove();
                    delete allUsers[userID].novels[novelID].timeline.years[yearID];

                    //Find position of year being deleted. remove from order list
                    var pos =  allUsers[userID].novels[novelID].timeline.yearsOrder.indexOf("year_"+yearID);
                    allUsers[userID].novels[novelID].timeline.yearsOrder.splice(pos, 1);
                }
            }
        });
    });

    //Delete Event on delete confirmation
    $(document.body).on("click", "#id_deleteEventForm", function(){
        var eventID = $("#id_feventName").attr("data-id");

        $.ajax({
            url: "deleteTimeline.php",
            method: "POST",
            data: {"getFunc": "deleteEvent", eID: eventID},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");
                    var yearID = $("#id_feventName").attr("data-idy");

                    $(".c_event[data-id='"+eventID+"']").remove();
                    delete allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID];

                    //Find position of event being deleted. remove from order list
                    var pos = allUsers[userID].novels[novelID].timeline.years[yearID].eventsOrder.indexOf("event"+yearID+"_"+eventID);
                    allUsers[userID].novels[novelID].timeline.years[yearID].eventsOrder.splice(pos, 1);
                }
            }
        });
    });

    //Delete CharPov on delete confirmation
    $(document.body).on("click", "#id_deleteCharPovForm", function(){
        var charPovID = $("#id_fcharName").attr("data-id");

        $.ajax({
            url: "deleteTimeline.php",
            method: "POST",
            data: {"getFunc": "deleteCharPov", cPovID: charPovID},
            dataType: "json",
            success: function(response){
                if(!response.error)
                {
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");
                    var yearID = $("#id_fcharName").attr("data-idy");
                    var eventID = $("#id_fcharName").attr("data-ide");

                    $(".c_charspov[data-id='"+charPovID+"']").remove();
                    delete allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters[charPovID];
                }
            }
        });
    });

    //Restore modal if cancel deletion of characterpov
    $(document.body).on("click", "#id_cancelDeleteCharPov", function(){
        $("#id_modalForm").modal("hide");
        
        $("#id_modalForm").one("hidden.bs.modal", function(e){
            var charPovID = $("#id_fcharName").attr("data-id");
            var charE = $(".c_charspov[data-id='"+charPovID+"']");

            var yearID = charE.parents(".c_year").attr("data-id");
            var eventID = charE.parents(".c_event").attr("data-id");
            var charName = charE.text();
            var charPov = charE.attr("data-content");
            var charExtra = charE.attr("data-original-title");

            $("#id_modalForm .modal-title").text("Edit Character");
            
            $("#id_modalForm .modal-body").empty().append("<label for='id_fcharName'>Name:</label>\
                <input class='form-control' id='id_fcharName' data-idy='"+yearID+"' data-ide='"+eventID+"' data-id='"+charPovID+"' value='"+charName+"'/>\
                <label for='id_fcharPov'>Point of View:</label>\
                <textarea class='form-control' id='id_fcharPov' autocomplete='off'>"+charPov+"</textarea>\
                <label for='id_fcharExtra'>Extra (50 characters min):</label>\
                <input class='form-control' id='id_fcharExtra' value='"+charExtra+"' />");
            $("#id_modalForm .modal-footer").empty().append("<i class='fas fa-trash-alt mr-auto c_deletebtn'></i>\
                <button type='submit' class='btn' id='id_saveCharPovForm' data-dismiss='modal'>Save</button>\
                <button type='button' class='btn' data-dismiss='modal'>Close</button>");
            
            $("#id_modalForm").modal("show");
        });
    });

    //---------------------------------------------------------------
    //DRAG AND SORT FUNCTIONS
    //---------------------------------------------------------------
    $(document.body).on("click", "#id_reorderYears", function(){

        //Check if reorder button is active
        //If already active, stop reordering and enable elements
        if($(this).hasClass("c_active"))
        {
            $(this).removeClass("c_active").text("Reorder Years");

            $(".c_yearName").attr("data-toggle", "collapse");
            $("#id_hideYears").prop("disabled", false);
            $("#id_hideAllEvents").prop("disabled", false);
            $("#id_characters").prop("disabled", false);
            $("#id_novelSelect").prop("disabled", false);
            $("#id_addYearWrap").show();
            $("#id_yearsWrap").on("mouseenter", ".c_yearNameWrap", function(){
                $(this).children(".c_editIcons").stop().fadeTo("fast", 1);}).on("mouseleave", ".c_yearNameWrap", 
                function(){$(this).children(".c_editIcons").stop().fadeTo("fast", 0);
            });

            $("#id_yearsWrap").sortable("disable");
        }//If not active, reorder and disable elements
        else
        {
            $(this).addClass("c_active").text("Stop Reordering");

            //Collapsing years to make sorting easier
            //Loop through each year button and collapse
            $(".c_yearName").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('hide');
            });
            $("#id_hideYears").text("Show Years");
    
            //Disable collapse
            $(".c_yearName").attr("data-toggle", "");
            //Disabling buttons and selection boxes to prevent changes
            $("#id_hideYears").prop("disabled", true);
            $("#id_hideAllEvents").prop("disabled", true);
            $("#id_characters").prop("disabled", true);
            $("#id_novelSelect").prop("disabled", true);
            $("#id_addYearWrap").hide();
            //Disabling editing icons showing up
            $("#id_yearsWrap").off("mouseenter", ".c_yearNameWrap").off("mouseleave", ".c_yearNameWrap");
    
            $("#id_yearsWrap").sortable({
                disabled: false,
                axis: "y",
                placeholder: "ui-state-highlight",
                update: function(event, ui){
                    //When move years, update positions to database and store order in an array
                    var yearsOrder = $(this).sortable("toArray");

                    $.ajax({
                        url: "saveTimeline.php",
                        method: "POST",
                        data: {"getFunc": "saveYearsPosition", yOrder: yearsOrder},
                        dataType: "json",
                        success: function(response){
                            if(!response.error)
                            {
                                var userID = $("#id_timelineWrap").data("userID");
                                var novelID = $("#id_timelineWrap").data("novelID");
                                allUsers[userID].novels[novelID].timeline.yearsOrder = yearsOrder;
                            }
                        }
                    });
                }
            });
        }
    });

    //RECHECK when reorder, does not collaspe, button says show events
    $(document.body).on("click", ".c_reorderEvents", function(){
        if($(this).hasClass("c_active"))
        {
            $(this).removeClass("c_active").text("Reorder Events");

            $("#id_reorderYears").prop("disabled", false);
            $(".c_yearName").prop("disabled", false);
            $("#id_hideYears").prop("disabled", false);
            $("#id_hideAllEvents").prop("disabled", false);
            $("#id_characters").prop("disabled", false);
            $("#id_novelSelect").prop("disabled", false);
            $("#id_addYearWrap").show();
            $(".c_addEventWrap").show();
            $("#id_yearsWrap").on("mouseenter", ".c_event", function(){
                $(this).children(".c_editIcons").stop().fadeTo("fast", 1);}).on("mouseleave", ".c_event", 
                function(){$(this).children(".c_editIcons").stop().fadeTo("fast", 0);
            });
            $("#id_yearsWrap").on("mouseenter", ".c_yearNameWrap", function(){
                $(this).children(".c_editIcons").stop().fadeTo("fast", 1);}).on("mouseleave", ".c_yearNameWrap", 
                function(){$(this).children(".c_editIcons").stop().fadeTo("fast", 0);
            });

            $(".c_hideEvents").prop("disabled", false);
            $(".c_eventNameWrap").prop("disabled", false);

            $(this).siblings(".list-group").sortable("disable");
        }
        else
        {
            $(this).addClass("c_active").text("Stop Reordering");

            //Collapsing events to make sorting easier
            if($(this).siblings(".c_hideEvents").text() == "Hide Events")
            {
                $(this).siblings(".list-group").find(".c_eventNameWrap").each(function(){
                    var collapseEventID = $(this).siblings("div .card-body").attr("id");
                    // console.log(collapseEventID);
                    $("#"+collapseEventID).collapse('hide');
                });

                $(this).siblings(".c_hideEvents").text("Show Events");
            }

            //Find parent ID
            var parentID = $(this).parents(".c_year").attr("data-id");
            //Loop through each year and collapse except for the parent
            $(".c_yearName").not(".c_yearName[href='#collapseYear"+parentID+"']").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('hide');
            });

            $("#id_reorderYears").prop("disabled", true);
            $(".c_yearName").prop("disabled", true);
            $("#id_hideYears").prop("disabled", true);
            $("#id_hideAllEvents").prop("disabled", true);
            $("#id_characters").prop("disabled", true);
            $("#id_novelSelect").prop("disabled", true);
            $("#id_addYearWrap").hide();
            $(".c_addEventWrap").hide();
            $("#id_yearsWrap").off("mouseenter", ".c_event").off("mouseleave", ".c_event");
            $("#id_yearsWrap").off("mouseenter", ".c_yearNameWrap").off("mouseleave", ".c_yearNameWrap");

            $(".c_hideEvents").prop("disabled", true);
            $(".c_eventNameWrap").prop("disabled", true);

            $(this).siblings(".list-group").sortable({
                disabled: false,
                axis: "y",
                placeholder: "ui-state-highlight",
                update: function(event, ui){
                    var eventsOrder = $(this).sortable("toArray");
                    var yearID = $(this).parents(".c_year").attr("data-id");
                    var userID = $("#id_timelineWrap").data("userID");
                    var novelID = $("#id_timelineWrap").data("novelID");
                    allUsers[userID].novels[novelID].timeline.years[yearID].eventsOrder = eventsOrder;
                    
                    $.ajax({
                        url: "saveTimeline.php",
                        method: "POST",
                        data: {"getFunc": "saveEventsPosition", eOrder: eventsOrder, yID: yearID},
                        dataType: "json"
                    });
                }
            });

        }
    });

    //---------------------------------------------------------------
    //HIDING ELEMENTS FUNCTIONS
    //---------------------------------------------------------------
    //When click, collapse year contents
    $("#id_hideYears").click(function(){
        if($("#id_hideYears").text() == "Hide Years"){
            //Loop through each year button and collapse
            $(".c_yearName").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('hide');
            });
            $("#id_hideYears").text("Show Years");
        }
        else
        {
            $(".c_yearName").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('show');
            });
            $("#id_hideYears").text("Hide Years");
        }  
    });

    //When click, hide all events
    $("#id_hideAllEvents").click(function(){
        if($("#id_hideAllEvents").text() == "Hide All Events")
        {
            //Loop through each event button and collapse
            $(".c_eventNameWrap").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                $("#"+collapseEventID).collapse('hide');
            });
            $("#id_hideAllEvents").text("Show All Events");
            $(".c_hideEvents").text("Show Events");
        }
        else
        {
            $(".c_eventNameWrap").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                $("#"+collapseEventID).collapse('show');
            });
            $("#id_hideAllEvents").text("Hide All Events");
            $(".c_hideEvents").text("Hide Events");
        }
    });

    //Binds on click event to mainTimeline div so each class appended with .c_hideEvents will work (see delegation)
    //When clicked, hide event cards by simulating a button click
    $("#id_timelineWrap").on("click", ".c_hideEvents", function(){
        var parentID = $(this).parents(".c_year");
        var hideEventsTxt = "Hide Events";

        if($(this).text() == hideEventsTxt)
        {
            $(parentID).find(".c_eventNameWrap").each(function(){
                var collapseEventID = $(this).siblings("div .card-body").attr("id");
                $("#"+collapseEventID).collapse('hide');
            });

            $(this).text("Show Events");
        }
        else
        {
            $(parentID).find(".c_eventNameWrap").each(function(){
                var collapseEventID = $(this).siblings("div .card-body").attr("id");
                $("#"+collapseEventID).collapse('show');
            });

            $(this).text(hideEventsTxt);
        }
    });

    //When character selection box is changed show selected timeline
    $("#id_characters").on("change", function(){
        var userID = $("#id_timelineWrap").data("userID");
        var novelID = $("#id_timelineWrap").data("novelID");
        var selectedChar = $(this).find("option:selected").val();
      
        //When select all characters, just fill in timeline again.
        if(selectedChar == "All Characters...")
        {
            //Remove timeline elements from container
            $(".c_year").remove();

            //Loop through timeline and add ui again
            for(i in allUsers[userID].novels[novelID].timeline.yearsOrder)
            {
                var yearID = allUsers[userID].novels[novelID].timeline.yearsOrder[i];
                yearID = yearID.replace("year_", "");

                var tempYear = allUsers[userID].novels[novelID].timeline.years[yearID];
                allUsers[userID].novels[novelID].timeline.appendYearUI(tempYear.name, tempYear.ID);

                for(j in allUsers[userID].novels[novelID].timeline.years[yearID].eventsOrder)
                {
                    var eventID = allUsers[userID].novels[novelID].timeline.years[yearID].eventsOrder[j];
                    eventID = eventID.replace("event"+yearID+"_", "");

                    var tempEvent = allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID];
                    tempYear.appendEventUI(yearID, eventID, tempEvent.name, tempEvent.synopsis);

                    for(k in allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters)
                    {
                        var tempChar = allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].characters[k];
                        tempEvent.appendCharacterUI(yearID, eventID, tempChar.ID, tempChar.name, tempChar.pov, tempChar.extra);
                    }
                }
            }

            //For each element that has this attribute, make it a popover
            $("[data-toggle='popover']").each(function () {
                $(this).popover();
            });
        }
        else
        {
            //Remove timeline UI
            //Remove timeline elements from container
            $(".c_year").remove();

            //Fill in timeline ui with a specific character's timeline
            allUsers[userID].novels[novelID].timeline.showCharacterTimeline(selectedChar);
        }

        //Hide all events when selection changes
        $(".c_eventNameWrap").each(function(){
            var collapseEventID = $(this).siblings("div").attr("id");
            $("#"+collapseEventID).collapse('hide');
        });
        $("#id_hideAllEvents").text("Show All Events");
        $(".c_hideEvents").text("Show Events");
    });
});

//Return text with special characters replaced and no white space
function convertInput(userInput)
{
    userInput = userInput.trim();
    userInput = userInput.replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    return userInput;
}

//Remove novels from Novel selection
function removeNovelsUI()
{
    $("#id_novelSelect").children().remove();
    $("#id_novelSelect").append("<option selected>Novels...</option>");
}

//Shows the timeline
function showTimelineUI(timelineName, timelineID)
{
    //Change name of timeline and ID
    $("#id_timelineName").prop("value", timelineName);
    $("#id_timelineName").attr("data-id", timelineID);

    $("#id_timelineControls").css("display", "flex");
    $("#id_yearsWrap").css("display", "flex");
    $("#id_addYearWrap").css("display", "flex");
}

//Hides the timeline
function hideTimelineUI()
{
    $("#id_timelineName").prop("value", "");
    $("#id_timelineControls").css("display", "none");
    $("#id_yearsWrap").css("display", "none");
    $("#id_addYearWrap").css("display", "none");
}

function ajax_getTimeline(allUsers, userID, novelID)
{
    $.ajax({
        url: "getTimeline.php",
        method: "POST",
        data: {"getFunc": "getTimeline", nID: novelID},
        dataType: "json",
        success: function(response){
            if(!response.error)
            {
                var timelineName = convertInput(response.name);

                allUsers[userID].novels[novelID].addTimeline(timelineName, response.id);
                showTimelineUI(timelineName, response.id);
                $("#id_addTimeline").css("display", "none");
                
                ajax_getYears(allUsers, userID, novelID, response.id);
            }
            else
            {
                //Show addTimeline UI if doesn't exist in database
                hideTimelineUI();
                $("#id_addTimeline").css("display", "flex");
            }
        }
    });
}

function ajax_getYears(allUsers, userID, novelID, timelineID)
{
    $.ajax({
        url: "getTimeline.php",
        method: "POST",
        data: {"getFunc": "getYears", tID: timelineID},
        dataType: "json",
        success: function(response){
            if(!response.error)
            {
                var deffereds = [];
                for(i in response.yearArray)
                {
                    var yearName = convertInput(response.yearArray[i].name);

                    allUsers[userID].novels[novelID].timeline.addYear(yearName, response.yearArray[i].id);

                    ajax_getEvents(allUsers, userID, novelID, response.yearArray[i].id);
                }  
            }
        }
    });
}

function ajax_getEvents(allUsers, userID, novelID, yearID)
{
    $.ajax({
        url: "getTimeline.php",
        method: "POST",
        data: {"getFunc": "getEvents", yID: yearID},
        dataType: "json",
        success: function(response){
            if(!response.error)
            {
                for(i in response.eventArray)
                {
                    var eventName = convertInput(response.eventArray[i].name);
                    var eventSyn = convertInput(response.eventArray[i].syn);

                    allUsers[userID].novels[novelID].timeline.years[yearID].addEvent(eventName, response.eventArray[i].id, eventSyn);
                    
                    ajax_getCharPovs(allUsers, userID, novelID, yearID, response.eventArray[i].id);
                }
            }
        }
    });
}

function ajax_getCharPovs(allUsers, userID, novelID, yearID, eventID)
{
    $.ajax({
        url: "getTimeline.php",
        method: "POST",
        data: {"getFunc": "getCharPovs", eID: eventID},
        dataType: "json",
        success: function(response){
            if(!response.error)
            {
                for(i in response.charpovArray)
                {
                    var charName = convertInput(response.charpovArray[i].name);
                    var charPov = convertInput(response.charpovArray[i].pov);
                    var charExtra = convertInput(response.charpovArray[i].extra);

                    allUsers[userID].novels[novelID].timeline.years[yearID].events[eventID].addCharacter(charName, response.charpovArray[i].id, charPov, charExtra, yearID);
                    allUsers[userID].novels[novelID].timeline.addCharsToSelectBox(charName);
                }
            }
        }
    });
}

//User class, holds novels
function User(uName, uID)
{
    this.name = uName;
    this.ID = uID;
    this.novels = [];

    //When created, add user to Selection box
    $("#id_userSelect").append("<option data-id='"+ uID + "'>" + uName + "</option>");

    //Add User to Selection box UI
    this.addUserUI = function()
    {
        $("#id_userSelect").append("<option data-id='" + this.ID + "'>" + this.name + "</option>");
    };

    //Add Novel to user, takes novel Name and ID
    this.addNovel = function(nName, nID)
    {
        var newNovel = new Novel(nName, nID);
        this.novels[nID] = newNovel;
    };

    //Add all novels belonging to user to selection box
    this.addNovelsUI = function()
    {
        for(i in this.novels)
        {
            this.novels[i].addNovelUI();
        }
    };
}

//Novel class, holds timelines
function Novel(nName, nID)
{
    this.name = nName;
    this.ID = nID;
    this.timeline = null;

    //When created, add novel to Selection box
    $("#id_novelSelect").append("<option data-id='" + nID + "'>" + nName + "</option>");

    //Add Novels to UI
    this.addNovelUI = function()
    {
        $("#id_novelSelect").append("<option data-id='" + this.ID + "'>" + this.name + "</option>");
    };

    //Adds a timeline and stores it into variable
    this.addTimeline = function(tName, tID)
    {
        var tTime = new Timeline(tName, tID);
        this.timeline = tTime;
    };
}

//Timeline class, holds years
function Timeline(tName, tID)
{   
    this.name = tName;
    this.ID = tID;
    this.years = [];
    this.yearsOrder = [];

    //Characters in the timeline, have unique names
    //Used for selection dropdown so can filter timeline by character
    this.timelineCharacters = [];

    //Create a year and adds to year array in timeline
    this.addYear = function(yName, yID)
    {
        var newYear = new Year(yName, yID);
        this.years[yID] = newYear;

        var yPos = 0;
        if(this.yearsOrder != undefined)
            yPos = this.yearsOrder.length + 1;

        this.yearsOrder[yPos] = "year_" + yID;

        //Append html for year to timeline
        this.appendYearUI(yName, yID);
    };

    //Append year UI to years container
    this.appendYearUI = function(yearName, yearID)
    {
      $("#id_yearsWrap").append("<div class='c_year col-12' id='year_" + yearID +"' data-id='" + yearID + "'>\
        <div class='c_yearNameWrap'>\
            <div class='c_editIcons'>\
                <i class='fas fa-trash-alt c_deletebtn'></i>\
                <i class='fas fa-edit c_editbtn'></i>\
            </div>\
            <a class='btn m-1 c_yearName' data-toggle='collapse' href='#collapseYear" + yearID +"'>" + yearName + "</a>\
        </div>\
        <div class='collapse show' id='collapseYear" + yearID +"'>\
            <button type='button' class='btn btn-sm ml-4 mt-2 c_hideEvents'>Hide Events</button>\
            <button type='button' class='btn btn-sm ml-2 mt-2 c_reorderEvents'>Reorder Events</button>\
            <ul class='list-group'>\
            </ul>\
            <div class='c_addEventWrap row justify-content-center mt-2 ml-4'>\
                <div class='col-md-auto'>\
                <h4 class='display-5'>\
                    <a class='c_addEventBtn' data-toggle='modal' data-target='#id_modalForm'><i class='fas fa-plus-circle'></i></a>\
                    Add Event\
                </h4>\
            </div>\
        </div>\
      </div>");
    };

    //Checks if character is in timeline array, if not adds to array
    this.addCharsToSelectBox = function(yChar)
    {
        if(this.timelineCharacters.indexOf(yChar) == -1)
        {
            this.timelineCharacters.push(yChar);  
            $("#id_characters").append("<option>" + yChar + "</option>");
        }
    };

    //Sorts and add characters to selection dropdown
    this.showCharsInSelectionBox = function()
    {
        this.timelineCharacters.sort();

        $.each(this.timelineCharacters, function(key, value){
          $("#id_characters").append("<option>" + value + "</option>");
        });
    };

    //When clicked, show just this character's timeline
    this.showCharacterTimeline = function(tCharacter)
    {
        //Store timeline object years array to variable
        var self = this;
        var yearsArray = self.years;

        //For each year loop through events and characters
        for(i in yearsArray)
        {
            if(yearsArray.hasOwnProperty(i))
            {
                var currentYear = yearsArray[i];
                var yearAdded = false;

                for(j in currentYear.events)
                {
                    var currentEvent = currentYear.events[j];
                    var eventAdded = false;
                    var characterFound = false;

                    //Check if character is in the event
                    for(k in currentEvent.characters)
                    {
                        if(currentEvent.characters[k].name == tCharacter)
                        {
                            characterFound = true;
                            break;
                        }
                    }

                    //Add the UI of all characters that are in the same event as the selected character to event UI
                    if(characterFound)
                    {
                        //Add year UI if not already added
                        if(!yearAdded)
                        {
                            self.appendYearUI(currentYear.name, currentYear.ID);
                            yearAdded = true;
                        }
                        //Add event UI if not already added
                        if(!eventAdded)
                        {
                            currentYear.appendEventUI(currentYear.ID, currentEvent.ID, currentEvent.name, currentEvent.synopsis);
                            eventAdded = true;
                        }
                        //Loop through all characters of the event that the character was found
                        for(k in currentEvent.characters)
                        {
                            var currentChar = currentEvent.characters[k];
                            currentEvent.appendCharacterUI(currentYear.ID, currentEvent.ID, currentChar.ID, currentChar.name, currentChar.pov, currentChar.extra);
                        }
                    }
                }
            }
        }

        //For each element that has this attribute, make it a popover
        $("[data-toggle='popover']").each(function () {
            $(this).popover();
        });
    };
}

//Year class, holds events
function Year(yName, yID)
{
    this.name = yName;
    this.ID = yID;
    this.events = [];
    this.eventsOrder = [];

    //Create an event and add to events array in year
    this.addEvent = function(eName, eID, eSynoposis)
    {
        var newEvent = new Event(eName, eID, eSynoposis, this.ID);
        this.events[eID] = newEvent;

        var ePos = 0;
        if(this.eventsOrder != undefined)
            ePos = this.eventsOrder.length + 1;

        this.eventsOrder[ePos] = "event" + this.ID + "_" + eID;

        //append html for events
        this.appendEventUI(this.ID, eID, eName, eSynoposis);
    };

    this.appendEventUI = function(yearID, eventID, eventName, eventSynposis)
    {
      $("#collapseYear"+yearID+" .list-group").append("<li class='list-group-item border-0 container-fluid ml-4 c_event' id='event" + yearID +"_"+eventID+"' data-id='" + eventID + "'>\
        <div class='c_editIcons'>\
            <i class='fas fa-trash-alt fa-2x c_deletebtn'></i>\
            <i class='fas fa-edit fa-2x c_editbtn'></i>\
        </div>\
        <div class='card'>\
            <div class='card-header p-1 btn btn-block c_eventNameWrap' data-toggle='collapse' href='#collapseEvent" + yearID +"-"+eventID+"' aria-expanded='true'>\
                <input type='text' class='form-control c_eventName' value='"+eventName+"' autocomplete='off' disabled>\
            </div>\
            <div class='collapse show card-body pt-0 pb-0' id='collapseEvent" + yearID +"-"+eventID+"'>\
                <div class='card-group row'>\
                    <div class='card col-8 border-top-0 border-bottom-0 border-left-0'>\
                        <div class='card-body'>\
                            <h4 class='card-title'>Synposis</h4>\
                            <textarea class='card-text c_synposis form-control' autocomplete='off' disabled>"+eventSynposis+"</textarea>\
                        </div>\
                    </div>\
                    <div class='card col-4 border-top-0 border-bottom-0 border-right-0'>\
                        <div class='card-body'>\
                            <h4 class='card-title'>Characters</h4>\
                            <div class='card-text c_eChars' id='Characters"+ yearID + "-"+eventID+"'>\
                                <button class='btn c_addChar' data-toggle='modal' data-target='#id_modalForm'><i class='fas fa-plus'></i></button>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
      </li>");
    };
}

//Event class, holds what characters are in each event
function Event(eName, eID, eSynoposis)
{
    this.ID = eID;
    this.name = eName;
    this.synopsis = eSynoposis;
    this.characters = [];

    this.addCharacter = function(cName, cID, cPov, cExtra, yID)
    {
        var newChar = new Character(cName, cID, cPov, cExtra);
        this.characters[cID] = newChar;

        this.appendCharacterUI(yID, this.ID, cID, cName, cPov, cExtra);
    };

    this.appendCharacterUI = function(yearID, eventID, charID, charName, charPov, charExtra)
    {
        //Only disable if Extra and Pov are null or empty
        if(charExtra)
        {
            if(!charPov)
                $("#Characters"+yearID+"-"+eventID+" .c_addChar").before("<button type='button' class='btn m-1 c_charspov' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-id='"+charID+"' title='"+charExtra+"' data-content=''>"+charName+"</button>");
            else
                $("#Characters"+yearID+"-"+eventID+" .c_addChar").before("<button type='button' class='btn m-1 c_charspov' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-id='"+charID+"' title='"+charExtra+"' data-content='"+charPov+"'>"+charName+"</button>");
        }
        else
        {
            if(!charPov)
                $("#Characters"+yearID+"-"+eventID+" .c_addChar").before("<button type='button' class='btn m-1 c_charspov c_disabled' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-id='"+charID+"' data-content='' disabled>"+charName+"</button>");
            else
                $("#Characters"+yearID+"-"+eventID+" .c_addChar").before("<button type='button' class='btn m-1 c_charspov' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-id='"+charID+"' data-content='"+charPov+"'>"+charName+"</button>");
        }

        $("#Characters"+yearID+"-"+eventID+" .c_charspov").popover();
    };
}

//Character class, has a name and pov
function Character(cName, cID, cPov, cExtra)
{
    this.ID = cID;
    this.name = cName;
    //perspective
    this.pov = cPov;
    this.extra = cExtra;
}
