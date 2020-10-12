
// Global variables
var visible = false;
var important = false;
var alert = false;
var showIcon = `<i class="far fa-eye"></i>`;
var hideIcon = `<i class="fas fa-eye-slash"></i>`;
var nonActive = `<i class="far fa-star"></i>`;
var active = `<i class="fas fa-star"></i>`;
var alertI = `<i class="fas fa-bell"></i>`;
var nonAlert = `<i class="far fa-bell"></i>`;
var taskList = [];

//Cache DOM with an Object
var UI = {};


// Function for the button. Better than an inline anny function
function showDetails(){
    console.log("btn clicked!");

    // Show details
    if(!visible){
        // Show details class on click
        UI.$secForm.removeClass("hide");
        UI.$btnShow.html( hideIcon + 'Hide Details');

        // change boolean
        visible = true;
    }
    else{ //Hide details
        UI.$secForm.addClass('hide');
        UI.$btnShow.html(showIcon + 'Show Details');

        // change boolean
        visible = false;
    }
}
// Function to move Task, when completed
function taskComplete(taskID){

    //delete Task from ToDo
    var task = $('#' + taskID);
    task.remove();
    console.log("done task");

    //Show task in Completed section
    var taskC = $('#' + taskID + 'c');
    taskC.removeClass('taskC');
    taskC.addClass('task');
    console.log("add complete");
}

//Function to delete Task, when prompted
function taskDelete(taskID){

    //delete Task from html
    var taskC = $('#' + taskID + 'c');
    taskC.remove();
    console.log("done html task");

    //Delete Task from Server
    $.ajax({
        url: 'http://fsdi.azurewebsites.net/api/tasks/' + taskID,
        type: 'DELETE',
    });
    console.log("Deleted from server");

}


// Change 'important button' when clicked
function toggleImportant(){

    console.log("btnImportant clicked");

    if(!important){
        UI.$btnImportant.removeClass("far active");
        UI.$btnImportant.addClass('fas');
        important = true;
    }
    else{
        UI.$btnImportant.removeClass('fas');
        UI.$btnImportant.addClass("far");
        important = false;
    }
}

// Change 'alert button' when clicked
function toggleAlert(){

    console.log("btnAlert clicked");

    if(!alert){
        UI.$btnAlert.removeClass("far");
        UI.$btnAlert.addClass('fas');
        alert = true;
    }
    else{
        UI.$btnAlert.removeClass('fas');
        UI.$btnAlert.addClass("far");
        alert = false;
    }
}

// Function to save a Task from User input
function saveTask(){
    var title = UI.$txtTitle.val();
    var date = UI.$txtDate.val();
    var desc = UI.$txtDescription.val();
    var location = UI.$txtLocation.val();

    //Alert user if date is empty
    if(!date){
        $("#alertError").removeClass('hide');
        setTimeout(() => { $("#alertError").addClass('hide'); } ,3000);
        return; // finish with the fn, do not continue
    }

    // Create task object
    var task = new Task(title, important, date, desc, alert, location);

    //Push into task array
    taskList.push(task);

    // clear the form
    clearForm();

    console.log(taskList);


    //Parsify this Task Object to string. 
    // var data = JSON.stringify(task);
    //http request 
   // save the task on the backend
   // 'send Task Object to our server database
   $.ajax({
       // Url is always a string type
       url: 'http://fsdi.azurewebsites.net/api/tasks',
       //POST b/c we're sending and recieving data
       type: 'POST',
       // data to be sent. Parse to string. 
       data: JSON.stringify(task),

       //Always used with 'data' to specify what type
       contentType: "application/json",
       success: function(res){

           res.dueDate = new Date(res.dueDate);
           res.createdOn = new Date(res.createdOn);
           displayTask(res);
           //print our server repsponse
            console.log(res);
            //show success to user
            $('#alertSuccess').removeClass('hide');

            //set a timer(mili) to remove 
            setTimeout(function(){
                //hide success to user
                $('#alertSuccess').addClass('hide');
            } , 3000);
       },
       error: function(details){
           //print if error 
            console.log("Error :(", details);
       }


   });

   //show success to user
   $('#alertSuccess').removeClass('hide');

}

//Function to clear form
function clearForm(){
    
    //Find all my form values and clear them!
    $(".control").val('');

        //Mark icons as not important
        UI.$btnImportant.removeClass("fas");
        UI.$btnImportant.addClass('far');
        important = false;

        UI.$btnAlert.removeClass('fas');
        UI.$btnAlert.addClass("far");
        alert = false;
}

// Function to grab our Tasks from server
function loadTasks(){

    $.ajax({
    url: 'http://fsdi.azurewebsites.net/api/tasks',
    type: 'GET',
    success: list => {
        //filter list for my Task Objects only
        //.filter parameter needs a function in its parameter
        let myTasks = list.filter(task => task.user === 'Katelynn');

         console.log(myTasks);

        // send Tasks to display fx
         for(let i = 0; i < myTasks.length; i++){
             myTasks[i].dueDate = new Date(myTasks[i].dueDate);
             myTasks[i].createdOn = new Date(myTasks[i].createdOn);       

             displayTask(myTasks[i]);
             displayCompleteTask(myTasks[i]);
        }
    },
    error: details => {
        //print if error 
         console.log("Error :(", details);
    }

    });
}

//Receives our Tasks from server and display
function displayTask(myTask){

    //Display correct Important Icon
    var myIcon;

    if(myTask.important === true){
        myIcon = active;
    }
    else{
        myIcon = nonActive;
    }

    //Display HTML
    var syntax = 
    `<div id=${myTask.id} class='task'>
        <div id="taskCheck">
            <button id="btnComp" class="btn btn-info" onclick="taskComplete(${myTask.id});">Complete Task</button>  
        </div>
        <div id="taskMain">
            <label class="task-title">${myTask.title}</label>
            <label class="task-desc">${myTask.description}</label>
        </div>

        <div id="taskLocal">
            <label class="task-date">Date: ${myTask.dueDate.toDateString()}</label>
            <label class="task-date">Time: ${myTask.dueDate.toTimeString()}</label>
            <label class="task-date">Where: ${myTask.location}</label>
        </div>
        <div id="taskImport">
            <label id="task-import">${myIcon}</label>
        </div>
    </div>`;

    //Add to pending tasks
    $("#pendingTasks").append(syntax);

}
//Displays Task in 'Completed Section'. Updates button
function displayCompleteTask(myTask){

    //Display correct Important Icon
    var myIcon;

    if(myTask.important === true){
        myIcon = active;
    }
    else{
        myIcon = nonActive;
    }

    //Display HTML
    var syntax = 
    `<div id='${myTask.id}c' class="taskC">
        <div id="taskCheckC">
            <button id="btnDelete" class="btn btn-info" onclick="taskDelete(${myTask.id});">Delete Task</button>  
        </div>
        <div id="taskMainC">
            <label class="task-title">${myTask.title}</label>
            <label class="task-desc">${myTask.description}</label>
        </div>

        <div id="taskLocalC">
            <label class="task-date">Date: ${myTask.dueDate.toDateString()}</label>
            <label class="task-date">Time: ${myTask.dueDate.toTimeString()}</label>
            <label class="task-date">Where: ${myTask.location}</label>
        </div>
        <div id="taskImportC">
            <label id="task-importC">${myIcon}</label>
        </div>
    </div>`;

    //Add to completed tasks
    $("#completeHead").append(syntax);
}

function init(){
    console.log("main page");

    //Load tasks on main view
    loadTasks();

    // user interface Object! Only caches the DOM once
    UI = {
        $btnShow: $('#btnShow'),
        $btnImportant: $('#btnImportant'),
        $btnBack: $('#btnBack'),
        $secForm: $('#secForm'),
        $btnSave: $('#btnSave'),
        $txtTitle: $('#txtTitle'),
        $txtDate: $('#txtDate'),
        $txtDescription: $('#txtDescription'),
        $btnAlert: $('#btnAlert'),
        $txtLocation: $('#txtLocation'),
    };

    // Get data from servers
    // hook (setUp) events 

        UI.$btnShow.click(showDetails);
        UI.$btnBack.click(showDetails);
        UI.$btnImportant.click(toggleImportant);
        UI.$btnAlert.click(toggleAlert);
        UI.$btnSave.click(saveTask);

}

window.onload = init;