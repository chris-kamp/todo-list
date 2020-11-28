import $ from "jquery";
import datepicker from "js-datepicker";
import EventHub from "/src/eventHub.js";
import {validateDate, validateDateInput} from "/src/validation.js";
import ProjectManager from "/src/project.js";

function displayCreateTodoPopup() {
    const mainContent = $("#mainContent");
    
    const backdrop = $(`<div id="popupBackdrop">`);
    const createTodoPopup = $(`<div id="createTodoPopup">`);
    const todoPopupHeading = $(`<div id="todoPopupHeading">`);
    const headingText = $(`<p>CREATE TODO</p>`);
    const todoPopupL1 = $(`<div id="todoPopupL1">`);
    const titleSpan = $(`<span>TITLE:</span>`);
    const todoTitleInput = $(`<input id="todoTitleInput" placeholder="Title" maxlength="30">`);
    const todoPopupL2 = $(`<div id="todoPopupL2">`);
    const projectSpan = $(`<span>PROJECT: </span>`);
    const todoProject = $(`<select id="todoProject"></select>`);
    const todoPopupL3 = $(`<div id="todoPopupL3">`);
    const dueDateSpan = $(`<span>DUE DATE: </span>`);
    const todoDueDate = $(`<input type="text" id="todoDueDate">`);
    const todoPopupL4 = $(`<div id="todoPopupL4">`);
    const prioritySpan = $(`<span>PRIORITY: </span>`);
    const todoPriority = $(`<select id="todoPriority">`);
    const priorityOptionHigh = $(`<option value="high">High</option>`);
    const priorityOptionNormal = $(`<option value="normal" selected="selected">Normal</option>`);
    const priorityOptionLow = $(`<option value="low">Low</option>`);
    const todoPopupL5 = $(`<div id="todoPopupL5">`);
    const descriptionSpan = $(`<p>DESCRIPTION:</p>`);
    const todoDescription = $(`<textarea id="todoDescription" placeholder="Description" maxlength="500">`);
    const todoPopupL6 = $(`<div id="todoPopupL6">`);
    const createTodo = $(`<button id="createTodo">CREATE</button>`);
    const cancelTodoPopup = $(`<button id="cancelTodoPopup" class="negative">CANCEL</button>`);
    const todoPopupL7 = $(`<div id="todoPopupL7">`);
    const errorText = $(`<span class="todoErrorText"></span>`);

    ProjectManager.getProjects().forEach(project => {
        $(`<option value="${project.getTitle()}">${project.getTitle()}</option>`).appendTo(todoProject);
        if(project.isSelected()) {
            todoProject.val(`${project.getTitle()}`);
        }
    });

    backdrop.appendTo(mainContent);
    createTodoPopup.appendTo($(mainContent));
    todoPopupHeading.appendTo(createTodoPopup);
    headingText.appendTo(todoPopupHeading);
    todoPopupL1.appendTo(createTodoPopup);
    titleSpan.appendTo(todoPopupL1);
    todoTitleInput.appendTo(todoPopupL1);
    todoPopupL2.appendTo(createTodoPopup);
    projectSpan.appendTo(todoPopupL2);
    todoProject.appendTo(todoPopupL2);
    todoPopupL3.appendTo(createTodoPopup);
    dueDateSpan.appendTo(todoPopupL3);
    todoDueDate.appendTo(todoPopupL3);
    todoPopupL4.appendTo(createTodoPopup);
    prioritySpan.appendTo(todoPopupL4);
    todoPriority.appendTo(todoPopupL4);
    priorityOptionHigh.appendTo(todoPriority);
    priorityOptionNormal.appendTo(todoPriority);
    priorityOptionLow.appendTo(todoPriority);
    todoPopupL5.appendTo(createTodoPopup);
    descriptionSpan.appendTo(todoPopupL5);
    todoDescription.appendTo(todoPopupL5);
    todoPopupL6.appendTo(createTodoPopup);
    createTodo.appendTo(todoPopupL6);
    cancelTodoPopup.appendTo(todoPopupL6);
    todoPopupL7.appendTo(createTodoPopup);
    errorText.appendTo(todoPopupL7);

    //Get the properties of a todo to be created from inputs on the page
    const getTodoProperties = () => {
        ///DEBUGGING
        // console.log(todoDueDate.val());
        return {
            title: todoTitleInput.val(),
            description: todoDescription.val(),
            dueDate: todoDueDate.val(),
            priority: todoPriority.val(),
            project: ProjectManager.getProjectByTitle(todoProject.val())
        }

    };

    createTodo.on("click", () => {
        PubSub.publish(EventHub.topics.TODO_CREATION_REQUESTED, getTodoProperties());
        // todoDueDatePicker.remove();
        // backdrop.remove();
        // createTodoPopup.remove();
    });

    createTodoPopup.on("click", () => {
        errorText.toggle();
    })

    //Display error text when todo creation fails
    function displayTodoCreationError(msg, data) {
        errorText.text(data);
        errorText.show();
    }
    EventHub.tokens.displayTodoCreationError = PubSub.subscribe(EventHub.topics.TODO_CREATION_ERROR, displayTodoCreationError);

    //Close the popup and remove the subscription to todo creation notification
    function closePopup() {
        todoDueDatePicker.remove();
        backdrop.remove();
        createTodoPopup.remove();
        unsub();
    }

    function unsub() {
        PubSub.unsubscribe(closePopup);
    }

    //When todo successfully created, close the popup
    EventHub.tokens.closePopup = PubSub.subscribe(EventHub.topics.TODO_CREATED, closePopup);

    cancelTodoPopup.on("click", () => {
        closePopup();
    });

    //Establish due date input as datepicker
    const todoDueDatePicker = datepicker(todoDueDate[0], {
        formatter: (input, date, instance) => {
            const value = date.toLocaleDateString();
            input.value = value;
        },
        startDay: 1,
        minDate: new Date(),
        dateSelected: new Date()
    });


    //Track whether mousedown occurred on due date input (to prevent hiding the date picker on mouseup)
    let mouseDownDueDate = false; 
    todoDueDate.on("mousedown", () => {
        mouseDownDueDate = true;
    });
    document.addEventListener("click", () => {
        if(mouseDownDueDate) {
            todoDueDatePicker['show']();
        }
        mouseDownDueDate = false;
    });

    //Disallow invalid date inputs
    todoDueDate.on("beforeinput", (event) => {
        if(event.originalEvent.data === null || event.originalEvent.data === "") {
            return;
        }
        //New value, after adding input and removing any selected text
        const pre = event.target.value.slice(0, event.target.selectionStart);
        const input = event.originalEvent.data;
        const post = event.target.value.slice(event.target.selectionEnd);
        const dateValue = pre + input + post;
        //Prevent input of invalid characters or where length would exceed 10 (dd/mm/yyyy)
        if(!validateDateInput(event.originalEvent.data) || dateValue.length > 10) {
            event.preventDefault();
        }
    });

    todoDueDate.on("input", (event) => {
        if(validateDate({
            dateStr: event.target.value,
            allowPartial: true
        }) === false){
            console.log("Please enter a valid date");
        } 
        const date = validateDate({
            dateStr: event.target.value,
            allowPartial: false
        })
        if(date){
            todoDueDatePicker.navigate(date);
            todoDueDatePicker.setDate(date);
        }
    });
}

export default displayCreateTodoPopup;