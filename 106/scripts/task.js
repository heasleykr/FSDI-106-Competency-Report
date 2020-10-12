class Task{
    
    /**
     * Initialze the Task Object
     */
    constructor(title, important, dueDate, description, alertText, location){
        
        this.title = title;
        this.important = important;
        this.dueDate = dueDate;
        this.description = description;
        this.alert = alertText;
        this.location = location;

        // Will tag each tast with you as the user
        this.user = 'Katelynn';

        //Get current date and time
        this.createdOn = new Date();
    }
}
