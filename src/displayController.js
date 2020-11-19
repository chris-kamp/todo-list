import $ from "jquery";
import EventHub from "/src/eventHub.js";
import datepicker from "js-datepicker";
import ProjectManager from "/src/project.js";
import {validateDate, validateDateInput} from "/src/validation.js";
import displaySidebar from "/src/sidebar.js";

const DisplayController = (() => {

    //Store references to relevant elements
    const todoTitleInput = $("#todoTitleInput");
    const todoDescription = $("#todoDescription");
    const todoDueDate = $("#todoDueDate");
    const todoPriority = $("#todoPriority");
    const todoProject = $("#todoProject");
    const projectTitleInput = $("#projectTitleInput");
    const addTodo = $("#addTodo");

    //Initialise page elements and event listeners
    const initialise = () => {
    
    //Initialise module sections
    displaySidebar();

        addTodo.on("click", () => {
            PubSub.publish(EventHub.topics.TODO_CREATION_REQUESTED, getTodoProperties());
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
            console.log(event.originalEvent.data);
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

    };



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



    //Push a project to the selection dropdown list
    const pushToProjectList = (msg, project) => {
        $(`<option value="${project.getTitle()}">${project.getTitle()}</option>`).appendTo(todoProject);
    };

    //Display a created todo on the page
    function displayTodo(msg, todo) {
        const parentProject = todo.getProject().getDisplayElement();

        const todoElement = $(`<div class="todo"></div>`);
        todoElement.appendTo(parentProject);

        const todoHeader = $(`<div class="todoHeader"></div>`);
        todoHeader.appendTo(todoElement);

        const todoTitle = $(`<p class="todoTitle">Title: ${todo.getTitle()}</p>`);
        todoTitle.appendTo(todoHeader);

        const todoDescription = $(`<p class='todoDescription'> Description: ${todo.getDescription()}</p>`);
        todoDescription.appendTo(todoHeader);

        const todoBody = $(`<div class="todoBody"></div>`);
        todoBody.appendTo(todoElement);
        
        const todoDueDate = $(`<p class="todoDueDate">Due date: ${todo.getDueDateFormatted()}</p>`);
        todoDueDate.appendTo(todoBody);

        const todoPriority = $(`<p class="todoPriority">Priority: ${todo.getPriority()}</p>`);
        todoPriority.appendTo(todoBody);
    }

    //Display a created project on the page
    function displayProject(msg, project) {
        //Move this is projectContainer is to be kept permanently
        const projectContainer = $("#projectContainer");

        const projectElement = $(`<div class="project"></div>`);
        projectElement.appendTo(projectContainer);

        const projectHeader = $(`<div class="projectHeader"></div>`);
        projectHeader.appendTo(projectElement);

        const projectTitle = $(`<div class="projectTitle">${project.getTitle()}</div>`);
        projectTitle.appendTo(projectHeader);

        //Link the element to its corresponding project
        project.setDisplayElement(projectElement);
    }

    return {initialise, pushToProjectList, displayTodo, displayProject};
})();

export default DisplayController;