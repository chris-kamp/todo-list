import $ from "jquery";
import datepicker from "js-datepicker";
import EventHub from "/src/eventHub.js";
import {validateDate, validateDateInput} from "/src/validation.js";
import ProjectManager from "/src/project.js";

function displayCreateTodoPopup() {
    const mainContent = $("#mainContent");

    const createTodoPopup = $(`<div id="createTodoPopup">`);
    const todoPopupHeading = $(`<div id="todoPopupHeading">`);
    const headingText = $(`<p>CREATE TODO</p>`);
    const todoPopupL1 = $(`<div id="todoPopupL1">`);
    const titleSpan = $(`<span>TITLE:</span>`);
    const todoTitleInput = $(`<input id="todoTitleInput" placeholder="Title">`);
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
    const descriptionSpan = $(`<span>DESCRIPTION:</span>`);
    const todoDescription = $(`<input id="todoDescription" placeholder="Description">`);
    const todoPopupL6 = $(`<div id="todoPopupL6">`);
    const createTodo = $(`<button id="createTodo">CREATE</button>`);
    const cancelTodoPopup = $(`<button id="cancelTodoPopup" class="negative">CANCEL</button>`);

    ProjectManager.getProjects().forEach(project => {
        $(`<option value="${project.getTitle()}">${project.getTitle()}</option>`).appendTo(todoProject);
        if(project.isSelected()) {
            todoProject.val(`${project.getTitle()}`);
        }
    });

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

    //Get the properties of a todo to be created from inputs on the page
    const getTodoProperties = () => {
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
        todoDueDatePicker.remove();
        createTodoPopup.remove();
    });

    cancelTodoPopup.on("click", () => {
        todoDueDatePicker.remove();
        createTodoPopup.remove();
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
        // console.log(event.originalEvent.data);
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