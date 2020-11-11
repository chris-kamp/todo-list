import EventHub from "/src/eventHub.js";

//Regex for any non-digit
const nonDigit = /\D/;
const invalidInput = /[^\d\/]/;

//Validate input into a date input field
function validateDateInput(dateInput) {
    if(dateInput.search(invalidInput) !== -1) {
        return false;
    } else {
        return true;
    }
}

//Validate a date string
function validateDate({dateStr, allowPartial}) {
    // console.log(dateStr.split("/"));
    const dateArray = dateStr.split("/");
    const yearStr = dateArray[2];
    const monthStr = dateArray[1];
    const dayStr = dateArray[0];
    let outputDate;
    if(dateArray.length > 3) {
        return false;
    } else {
        if(dayStr) {
            if(!validateDay(dayStr)) {
                return false;
            }
        }
        if(monthStr) {
            if(!validateMonth(monthStr)) {
                return false;
            }
        }
        if(yearStr) {
            if(!validateYear(yearStr)) {
                return false;
            }
        }
    }
    //If input is a valid and complete date, check if it is in the past
    if(dateArray.length === 3 &&
        yearStr.length === 4 &&
        monthStr !== "0" &&
        monthStr !== "" &&
        dayStr !== "0" &&
        dayStr !== "") 
        {
        const year = Number(yearStr);
        const month = Number(monthStr) - 1; //Months are zero-indexed
        const day = Number(dayStr);
        outputDate = new Date(year, month, day);
        const now = new Date();
        now.setHours(0,0,0,0);
        if(outputDate < now) {
            //console.log("Date is in the past");
            return false;
        } 
    } else if(!allowPartial) {
        //If input not valid and complete, and partial dates are not allowed, return false
        return false;
    }
    return outputDate;
}

//Validate a day of the month (allowing for partial input)
function validateDay(day) {
    if(day.length > 2) {
        // console.log("Day too long");
        return false;
    }
    if(day.indexOf(nonDigit) !== -1) {
        // console.log("Day contains non-digit");
        return false;
    }
    const dayNumber = Number(day);
    if(dayNumber > 31) {
        // console.log("Day exceeds valid range");
        return false;
    }
    if(day.length > 1 && dayNumber <= 0) {
        //console.log("Day is zero or negative");
        return false;
    }
    if(day.length === 1 && dayNumber > 3) {
        //console.log("Day's leading digit exceeds valid range");
        return false;
    }
    return true;
}

//Validate a month (allowing for partial input)
function validateMonth(month) {
    if(month.length > 2) {
        // console.log("Month too long");
        return false;
    }
    if(month.indexOf(nonDigit) !== -1) {
        // console.log("Month contains non-digit");
        return false;
    }
    const monthNumber = Number(month);
    if(monthNumber > 12) {
        // console.log("Month not within valid range");
        return false;
    }
    if(month.length > 1 && monthNumber <= 0) {
        //console.log("Month is zero or negative");
        return false;
    }
    return true;
}

//Validate a year (allowing for partial input)
function validateYear(year) {
    if(year.length > 4) {
        // console.log("Year exceeds 4 digits");
        return false;
    }
    if(year.indexOf(nonDigit) !== -1) {
        // console.log("Year contains non-digit");
        return false;
    }
    if(year.slice(0,1) === "0") {
        //console.log("Year has leading zero");
        return false;
    }
    return true;
}

//Validate the properties of a Todo
//WIP: This should take the properties of a todo when creation request published, validate the date, validate anything else required, and publish success (along with the validated properties) or failure to trigger actual creation of the todo
function validateTodo(msg, {title, description, dueDate, priority, project}) {
    dueDate = validateDate({dateStr: dueDate, allowPartial: false});
    if(dueDate === false) {
        console.log("Failed to validate todo due date. Please enter a valid due date (dd/mm/yyyy).");
        return false;
    } else {
        //WIP: Allow for other formats
        PubSub.publish(EventHub.topics.TODO_VALIDATED, {title, description, dueDate, priority, project});
    }
}

export {validateDate, validateDateInput, validateTodo};