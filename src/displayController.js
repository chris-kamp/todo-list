import $ from "jquery";
import displaySidebar from "/src/sidebar.js";
import displayCreateTodoPopup from "/src/createTodoPopup.js";
import EventHub from "/src/eventHub.js";

const DisplayController = (() => {

    //Store references to relevant elements
    const todoProject = $("#todoProject");

    //Initialise page elements and event listeners
    const initialise = () => {
        const completedListHeading = $("#completedListHeading");
        const showCompleted =  $("#showCompleted");

        //Click to pop up new todo creation box
        $("#newTodo").on("click", () => {
            //Generate a popup only if not already present
            if(!($("#createTodoPopup").length)) {
                displayCreateTodoPopup();
            }
        });

        showCompleted.on("click", () => {
            $("#completedTodoList").toggle();
            completedListHeading.toggle();
            let completedShown;
            if(showCompleted.text() === "SHOW COMPLETED") {
                showCompleted.text("HIDE COMPLETED");
                showCompleted.addClass("negative");
                completedShown = true;
            } else {
                showCompleted.text("SHOW COMPLETED");                
                showCompleted.removeClass("negative");
                completedShown = false;
            }
            PubSub.publish(EventHub.topics.STORE_SHOW_COMPLETED, completedShown);
        });

        //Initialise module sections
        displaySidebar();
    };


    //Display a created todo on the page
    function displayTodos(msg, project) {
        const todos = project.getTodos();
        const todoList = $("#todoList");
        todoList.empty();
        const completedTodoList = $("#completedTodoList");
        completedTodoList.empty();
        todos.forEach(todo => {
                const todoContainer = $(`<div class="todoContainer"></div>`);

                const todoElement = $(`<div class="todo"></div>`);
                todoElement.appendTo(todoContainer);
        
                const todoHeader = $(`<div class="todoHeader"></div>`);
                todoHeader.appendTo(todoElement);
        
                const todoTitle = $(`<span class="todoTitle">${todo.getTitle()}</span>`);
                todoTitle.appendTo(todoHeader);

                const todoDueDate = $(`<span class="todoDueDate">${todo.getDueDateFormatted()}</span>`);
                todoDueDate.appendTo(todoHeader);

                const todoCheckbox = $(`<input type="checkbox" class="todoCheckbox"></input>`);
                todoCheckbox.appendTo(todoHeader);
                if(todo.isCompleted()) {
                    todoCheckbox.prop("checked", true);
                }
        
                const todoBody = $(`<div class="todoBody"></div>`);
                todoBody.appendTo(todoElement);
                todoBody.hide();
                
                const todoDescription = $(`<p class='todoDescription'>${todo.getDescription()}</p>`);
                todoDescription.appendTo(todoBody);

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
                //Todos expand and collapse description when clicked
                todoElement.on("click", (event) => {
                    if(event.target !== todoCheckbox[0]) {
                        todoBody.toggle();
                    }
                });
                //Checkbox completes or un-completes todo when clicked
                todoCheckbox.on("change", () => {
                    todo.toggleCompleted();
                    PubSub.publish(EventHub.topics.STORE_TODOS, todos);
                    displayTodos("", project);
                });

                if(todo.isCompleted()) {
                    todoContainer.appendTo(completedTodoList)
                } else {
                    todoContainer.appendTo(todoList)
                }
                
            // }
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