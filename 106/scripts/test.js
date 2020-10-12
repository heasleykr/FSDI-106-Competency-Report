// Function to request info, using Ajax, from server
function testGet(){
    // Ajax expects an object with configuration 
$.ajax({

    //This Url is where the server is AT/Located 
    url: 'http://restclass.azurewebsites.net/api/test',
    // You must specifiy type
    type: 'GET',

    //Paramater is the 'response' from the server. 
    // Success means you're getting info back from server!!
    //Conventionally it's a 'res'
    success: function(response){
        //Do this on success
        console.log("req success", response);
    },

    //Parameter is the Error details!
    error: function(details){
        //Do this on Error
        console.log("Error :(", details);
    }


});

}

// CR: Add the elements on 'display'
    // Important icon must be displayed
    // Better CSS styling
    //Extra Credit would be to add 'edit' feature
        //show completed tasks? When clicked