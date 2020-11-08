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
function validateDate(dateStr) {
    // console.log(dateStr.split("/"));
    const dateArray = dateStr.split("/");
    const yearStr = dateArray[2];
    const monthStr = dateArray[1];
    const dayStr = dateArray[0];
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
        const date = new Date(year, month, day);
        const now = new Date();
        now.setHours(0,0,0,0);
        if(date < now) {
            //console.log("Date is in the past");
            return false;
        }
    }
    return true;
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

export {validateDate, validateDateInput};