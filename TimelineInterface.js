
function User(uName, uID)
{
    this.name = uName;
    this.ID = uID;
    this.novels = [];

    $("#id_userForm").append("<option class='c_user' data-ID='" + uID + "'>" + uName + "</option>");

    this.addNovel = function(nName, nID)
    {
        var newNovel = new Novel(nName, nID);
        this.novels.push(newNovel);
        // console.log("Novel Added!");
    }

    this.addUI = function()
    {
        $("#id_userForm").append("<option class='c_user' data-ID='" + this.ID + "'>" + this.name + "</option>");
    }

    this.removeNovelsUI = function()
    {
        $("#id_novelForm").children().remove();
        
        $("#id_sceneForm").children().remove();
    }
}

function Novel(nName, nID)
{
    this.name = nName;
    this.ID = nID;
    this.scenes = [];

    this.addScene = function(sName, sID)
    {
        var newScene = new Scene(sName, sID);
        this.scenes.push(newScene);
    }

    this.addUI = function()
    {
        $("#id_novelForm").append("<option class='c_novel' data-ID='" + this.ID + "'>" + this.name + "</option>");
    }

    this.removeScenesUI = function()
    {
        $("#id_sceneForm").children().remove();

        $("#id_notesArea").children().remove();
    }
}

function Scene(sName, sID)
{
    this.name = sName;
    this.ID = sID;
    this.notes = [];

    this.addNote = function(nName, nID)
    {
        var newNote = new Note(nName, nID);
        this.notes.push(newNote);
    } 

    this.addUI = function()
    {
        $("#id_sceneForm").append("<option class='c_scene' data-ID='" + this.ID + "'>" + this.name + "</option>");
    }

    this.removeNotesUI = function()
    {
        $("#id_notesArea").children().remove();
    }
}

function Note(nName, nID)
{
    this.name = nName;
    this.ID = nID;

    this.addUI = function()
    {
        $("#id_notesArea").append("<div class='c_notes mx-auto'>\
                                    <label for='id_notesForm" + this.ID + "'>" + this.name + "</label>\
                                    <textarea class='form-control' id='id_notesForm" + this.ID + "' data-ID='" + this.ID + "'></textarea>\
                                </div>");
    }
}










$("#id_oldscript").click(function(){
    //Create default timeline
    admin.createTimeline("Edward and Adrienne");
    
    //Getting json data from a function since it is long
    var timelineJSON = getJsonData();

    //Iterate through json data and create timeline object structure
    for(j in timelineJSON.year)
    {
        admin.timelines[0].createYear(timelineJSON.year[j].date);

        for(i in timelineJSON.year[j].event)
        {
            var eventName = timelineJSON.year[j].event[i].title;
            var eventSynposis = timelineJSON.year[j].event[i].synopsis;
            admin.timelines[0].years[j].createEvent(eventName, eventSynposis);

            for(k in timelineJSON.year[j].event[i].character)
            {
                // var eventID = admin.timelines[0].years[j].e_ID - 1;
                var charName = timelineJSON.year[j].event[i].character[k].name;
                var charThoughts = timelineJSON.year[j].event[i].character[k].thoughts;
                var charAge = timelineJSON.year[j].event[i].character[k].age;
                admin.timelines[0].years[j].events[i].createCharacter(charName, charAge, charThoughts, j);

                //Add character to timeline array within the timeline
                admin.timelines[0].addCharacters(charName);
            }
        }
    }

    //Once loop through json, add characters to selection box
    admin.timelines[0].addCharactersToSelection();

    //For each element that has this attribute, make it a popover
    $("[data-toggle='popover']").each(function () {
        $(this).popover();
    });

    //Hide all events when document loads
    $("#eHideAllBtn").click();


    //EVENT FUNCTIONS
    //When click, collapse year contents
    $("#yHideBtn").click(function(){
        if($("#yHideBtn").text() == "Hide Years"){
            //Loop through each year title button and collapse
            $(".yTitleBtn").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('hide');
            });
            $("#yHideBtn").text("Show Years");
        }
        else
        {
            $(".yTitleBtn").each(function(){
                var collapseYearID = $(this).attr("href");
                $(collapseYearID).collapse('show');
            });
            $("#yHideBtn").text("Hide Years");
        }  
    });

    //When click, hide all events
    $("#eHideAllBtn").click(function(){
        if($("#eHideAllBtn").text() == "Hide All Events")
        {
            //Loop through each event title button and collapse
            $(".eTitleBtn").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                $("#"+collapseEventID).collapse('hide');
            });
            $("#eHideAllBtn").text("Show All Events");
            $(".eHideBtn").text("Show Events");
        }
        else
        {
            $(".eTitleBtn").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                $("#"+collapseEventID).collapse('show');
            });
            $("#eHideAllBtn").text("Hide All Events");
            $(".eHideBtn").text("Hide Events");
        }
    });

    //Binds on click event to mainTimeline div so each class appended with .eHideBtn will work (see delegation)
    //When clicked, hide event cards by simulating a button click
    var eHideBtnTxt = "Hide Events";
    $("#mainTimeline").on("click", ".eHideBtn", function(){
        var parentID = $(this).parents("div .row");

        if($(this).text() == "Hide Events")
        {
            $(parentID).find(".eTitleBtn").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                // console.log(collapseEventID);
                $("#"+collapseEventID).collapse('hide');
            });

            $(this).text("Show Events");
        }
        else
        {
            $(parentID).find(".eTitleBtn").each(function(){
                var collapseEventID = $(this).siblings("div").attr("id");
                // console.log(collapseEventID);
                $("#"+collapseEventID).collapse('show');
            });

            $(this).text("Hide Events");
        }
    });

    //When character selection box is changed show selected timeline
    $(".form-control-inline").on("change", function(){
      var selectedChar = $(this).find("option:selected").val();
      
      //When select all characters, just fill in timeline again.
      if(selectedChar == "All Characters...")
      {
        $("#yearsContainer").remove();

        admin.appendTimelineUI();
        //Loop through timeline and add ui again
        $.each(admin.timelines[0].years, function(yKey, yValue)
        {
          admin.timelines[0].appendYearUI(yKey, yValue.name);
          $.each(this.events, function(eKey, eValue)
          {
            yValue.appendEventUI(yKey, eKey, eValue.name, eValue.synopsis);
            $.each(this.characters, function(cKey, cValue)
            {
              eValue.appendCharacterUI(yKey, eKey, cValue.name, cValue.age, cValue.thoughts);
            });
          });
        });

        //For each element that has this attribute, make it a popover
        $("[data-toggle='popover']").each(function () {
          $(this).popover();
        });
      }
      else
      {
        //Remove timeline UI
        $("#yearsContainer").remove();

        //Fill in timeline ui with a specific character's timeline
        admin.timelines[0].showCharacterTimeline(selectedChar);
      }

      //Hide all events when selection changes
      $(".eTitleBtn").each(function(){
          var collapseEventID = $(this).siblings("div").attr("id");
          $("#"+collapseEventID).collapse('hide');
      });
      $("#eHideAllBtn").text("Show All Events");
      $(".eHideBtn").text("Show Events");
    });
});


//User class, holds timelines
function UserOLD(uName)
{
    this.name = uName;
    this.ID = 0;
    this.timelines = [];
    this.t_ID = 0;

    //Creates a timeline and adds to the array
    this.createTimeline = function(tName)
    {
        var tempID = this.generateTimelineID();
        var tTime = new Timeline(tempID, tName);
        this.timelines.push(tTime);

        //Container to put all the years
        this.appendTimelineUI();
    };

    //Return timeline ID and iterate for next one
    this.generateTimelineID = function()
    {
        var tempID = this.t_ID;
        this.t_ID++;

        return tempID;
    };

    //Append timeline container div for easy add and removal
    this.appendTimelineUI = function()
    {
      $("#mainTimeline").append("<div id='yearsContainer'></div>");
    };
}

//Timeline class, holds years
function Timeline(tID, tName)
{   
    this.name = tName;
    this.ID = 0;
    this.years = [];
    this.y_ID = 0;
    //Characters in the timeline, have unique names
    //Used for selection dropdown so can filter timeline by character
    this.timelineCharacters = [];

    //Create a year and adds to year array in timeline
    this.createYear = function(yName)
    {
        //Checks if the year name exists
        var exists = false;
        for(var i = 0; i < this.years.length; i++)
        {
            if(this.years[i].name == yName)
                exists = true;
        }

        if(!exists)
        {
            //Generate ID and add to years array
            var tempID = this.generateYearID();
            var newYear = new Year(tempID, yName);
            this.years.push(newYear);

            //Append html for year to timeline
            this.appendYearUI(tempID, yName);

            // console.log("Year is: " + newYear.name);
            // console.log("Year ID: " + newYear.ID);
        }
        else
            alert(yName + " already exists!");
    };

    //Return year ID and iterate for next one
    this.generateYearID = function()
    {
        var tempID = this.y_ID;
        this.y_ID++;

        return tempID;
    };

    //Add year UI
    this.appendYearUI = function(yearID, yearName)
    {
      $("#yearsContainer").append("<div class='row' id='Year" + yearID +"'>\
        <ul class='list-unstyled col'>\
            <li><button type='button' class='btn m-1 yTitleBtn' data-toggle='collapse' href='#collapseYear" + yearID +"'>" + yearName + "</button></li>\
            <div class='collapse show' id='collapseYear" + yearID +"'>\
                <button type='button' class='btn btn-sm ml-4 mb-1 eHideBtn'>Hide Events</button>\
                <ul class='list-group'>\
                </ul>\
            </div>\
        </ul>\
      </div>");
    };

    //Checks if character is in timeline array, if not adds to array
    this.addCharacters = function(yChar)
    {
      if(this.timelineCharacters.indexOf(yChar) == -1)
        this.timelineCharacters.push(yChar);  
    };

    //Sorts and add characters to selection dropdown
    this.addCharactersToSelection = function()
    {
        this.timelineCharacters.sort();

        $.each(this.timelineCharacters, function(key, value){
          $(".form-control-inline").append("<option>" + value + "</option>");
        });
    };

    //When clicked, show just this character's timeline
    this.showCharacterTimeline = function(tCharacter)
    {
      //Add container div
      admin.appendTimelineUI();

      //For each year loop through events and characters
      $.each(this.years, function(yKey, yValue)
      {
        var yearAdded = false;
        $.each(this.events, function(eKey, eValue)
        {
          var eventAdded = false;
          var characterFound = false;
          // $.each(this.characters, function(cKey, cValue)
          // {
          //   //Mark character as found if in the event and break out of loop
          //   if(cValue.name == tCharacter && !characterFound)
          //   {
          //     characterFound = true;
          //   }
          // });

          for(i in this.characters)
          {
            if(this.characters[i].name == tCharacter)
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
              admin.timelines[0].appendYearUI(yKey, yValue.name);
              yearAdded = true;
            }
            //Add event UI if not already added
            if(!eventAdded)
            {
              yValue.appendEventUI(yKey, eKey, eValue.name, eValue.synopsis);
              eventAdded = true;
            }
            //Loop through all characters of the event that the character was found
            $.each(this.characters, function(cKey, cValue)
            {
              eValue.appendCharacterUI(yKey, eKey, cValue.name, cValue.age, cValue.thoughts);
            });
          }
        });
      });

      //For each element that has this attribute, make it a popover
      $("[data-toggle='popover']").each(function () {
        $(this).popover();
      });
    };
}

//Year class, holds events
function Year(yID, yName)
{
    this.ID = yID;
    this.name = yName;
    this.events = [];
    this.e_ID = 0;

    //Create an event and add to events array in year
    this.createEvent = function(eName, eSynoposis)
    {
        //Generate ID and add to events array
        var tempID = this.generateEventID();
        
        //append html for events
        this.appendEventUI(this.ID, tempID, eName, eSynoposis);

        var newEvent = new Event(tempID, eName, eSynoposis, this.ID);
        this.events.push(newEvent);

        // console.log("Event is: " + newEvent.name);
        // console.log("Event ID: " + newEvent.ID);
    }

    //Generate ID for next event to be put into array
    this.generateEventID = function()
    {
        var tempID = this.e_ID;
        this.e_ID++;

        return tempID;
    };

    this.appendEventUI = function(yearID, eventID, eventName, eventSynposis)
    {
      $("#collapseYear"+yearID+" .list-group").append("<li class='list-group-item border-0' id='Event" + yearID +"-"+eventID+"'>\
          <button type='button' class='btn m-1 eTitleBtn' data-toggle='collapse' href='#collapseEvent" + yearID +"-"+eventID+"'><h4>"+eventName+"</h4></button>\
          <div class='collapse show' id='collapseEvent" + yearID +"-"+eventID+"'>\
          <div class='container-fluid'>\
              <div class='card-group row'>\
                  <div class='card col-8'>\
                      <div class='card-body'>\
                          <h4 class='cart-title'>Synposis</h4>\
                          <p class='cart-text'>"+eventSynposis+"</p>\
                      </div>\
                  </div>\
                  <div class='card col-4'>\
                      <div class='card-body'>\
                          <h4 class='cart-title'>Characters</h4>\
                          <p class='cart-text' id='Characters"+ yearID + "-"+eventID+"'>\
                          </p>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </li>");
    };
}

//Event class, holds what characters are in each event
function Event(eID, eName, eSynoposis, yearID)
{
    this.ID = eID;
    this.pYear_ID = yearID;
    this.name = eName;
    this.synopsis = eSynoposis;
    this.characters = [];
    this.c_ID = 0;

    this.createCharacter = function(cName, cAge, cThoughts, pyID)
    {
        var tempID = this.generateCharacterID();
        
        this.appendCharacterUI(pyID, this.ID, cName, cAge, cThoughts);

        var newChar = new Character(tempID, cName, cAge, cThoughts);
        this.characters.push(newChar);
    };

    //Generate ID for next character to be put into array
    this.generateCharacterID = function()
    {
        var tempID = this.c_ID;
        this.c_ID++;

        return tempID;
    };

    this.appendCharacterUI = function(yearID, eventID, charName, charAge, charThoughts)
    {
      if(charAge != null)
      {
        if(charThoughts == "")
          $("#Characters"+yearID+"-"+eventID).append("<button type='button' class='btn m-1' data-toggle='popover' data-trigger='focus' data-placement='bottom' title='Age: "+charAge+"' data-content='"+charThoughts+"' disabled>"+charName+"</button>");
        else
          $("#Characters"+yearID+"-"+eventID).append("<button type='button' class='btn m-1' data-toggle='popover' data-trigger='focus' data-placement='bottom' title='Age: "+charAge+"' data-content='"+charThoughts+"'>"+charName+"</button>");
      }
      else
      {
        if(charThoughts == "")
          $("#Characters"+yearID+"-"+eventID).append("<button type='button' class='btn m-1' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-content='"+charThoughts+"' disabled>"+charName+"</button>");
        else
          $("#Characters"+yearID+"-"+eventID).append("<button type='button' class='btn m-1' data-toggle='popover' data-trigger='focus' data-placement='bottom' data-content='"+charThoughts+"'>"+charName+"</button>");
      }
    };
}

//Character class, has a name and thoughts
function Character(cID, cName, cAge, cThoughts)
{
    this.ID = cID;
    this.name = cName;
    this.age = cAge;
    this.thoughts = cThoughts;
}
