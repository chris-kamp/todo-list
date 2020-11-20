import $ from "jquery";
import displaySidebar from "/src/sidebar.js";
import displayCreateTodoPopup from "/src/createTodoPopup.js";

const DisplayController = (() => {

    //Store references to relevant elements
    const todoProject = $("#todoProject");

    //Initialise page elements and event listeners
    const initialise = () => {

        //Click to pop up new todo creation box
        $("#newTodo").on("click", () => {
            //Generate a popup only if not already present
            if(!($("#createTodoPopup").length)) {
                displayCreateTodoPopup();
            }
        });

        //Initialise module sections
        displaySidebar();
        // displayCreateTodoPopup();
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

    return {initialise, displayTodo, displayProject};
})();

export default DisplayController;