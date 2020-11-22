import $ from "jquery";
import displaySidebar from "/src/sidebar.js";
import displayCreateTodoPopup from "/src/createTodoPopup.js";
import EventHub from "/src/eventHub.js";

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
    function displayTodos(msg, project) {
        const todos = project.getTodos();
        const parentElement = $("#todoList");
        parentElement.empty();
        todos.forEach(todo => {
            const todoElement = $(`<div class="todo"></div>`);
            todoElement.appendTo(parentElement);
    
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

            switch(todo.getPriority()) {
                case "high":
                    todoElement.addClass("priorityHigh");
                    break;
                case "normal":
                    todoElement.addClass("priorityNormal");
                    break;
                case "low":
                    todoElement.addClass("priorityLow");
                    break;
            }
        });
    }

    //Display a created project on the page
    function displayProject(msg, project) {
        //Move this if projectContainer is to be kept permanently
        const projectContainer = $("#projectContainer");

        const projectElement = $(`<div class="project"></div>`);
        projectElement.appendTo(projectContainer);
        projectElement.on("click", () => {
            PubSub.publish(EventHub.topics.PROJECT_SELECTED, project);
        });

        const projectHeader = $(`<div class="projectHeader"></div>`);
        projectHeader.appendTo(projectElement);

        const projectTitle = $(`<div class="projectTitle">${project.getTitle()}</div>`);
        projectTitle.appendTo(projectHeader);

        //Link the element to its corresponding project
        project.setDisplayElement(projectElement);
        if(project.isSelected()) {
            projectElement.removeClass("unselectedProject").addClass("selectedProject");
        } else {
            projectElement.removeClass("selectedProject").addClass("unselectedProject");
        }

    }

    return {initialise, displayTodos, displayProject};
})();

export default DisplayController;