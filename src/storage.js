import $ from "jquery";
import EventHub from "/src/eventHub.js";
import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";
import format from 'date-fns/format';

let selectedProjectTitle;

//Determine whether storage available
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "STORAGE_TEST";
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            (storage && storage.length !== 0);
    }
}

//Store the state of the project list
function storeProjects(msg, projects) {
    if(storageAvailable("localStorage")) {
        const projectsArray = [];
        projects.forEach(project => {
            const title = project.getTitle();
            const selected = project.isSelected();
            const jsonProject = {
                title: title,
                selected: selected
            };
            projectsArray.push(jsonProject);
        });
        const jsonArray = JSON.stringify(projectsArray);
        localStorage.setItem("projects", jsonArray);
    }
}

//Retrieve projects from storage and display

function retrieveProjects(msg, data) {
    if(storageAvailable("localStorage") && localStorage.getItem("projects") !== null) {
        
        const jsonArray = localStorage.getItem("projects");
        const projectsArray = JSON.parse(jsonArray);
        projectsArray.forEach(project => {
            PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, project);
            if(project.selected){
                selectedProjectTitle = project.title;
                localStorage.setItem("selectedProjectTitle", selectedProjectTitle);
            }
        });
            
        //Retrieve todos once project retrieval finished
        PubSub.publish(EventHub.topics.RETRIEVE_TODOS, "");


    } else {
        PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, {
            title: "Uncategorised",
            selected: true
        });
    }
}

//Store the state of the todos list
function storeTodos(msg, todos) {
    if(storageAvailable("localStorage")) {
        const todosArray = [];
        todos.forEach(todo => {
            const title = todo.getTitle();
            const description = todo.getDescription();
            const dueDate = format(todo.getDueDate(), "dd/MM/yyyy");
            const priority = todo.getPriority();
            const project = todo.getProject().getTitle();
            const loaded = true;
            const completed = todo.isCompleted();
            const jsonTodo = {
                title: title,
                description: description,
                dueDate: dueDate,
                priority: priority,
                project: project,
                loaded: loaded,
                completed: completed
            };
            todosArray.push(jsonTodo);
        });
        const jsonArray = JSON.stringify(todosArray);
        localStorage.setItem("todos", jsonArray);
    }
}

//Retrieve stored todos
function retrieveTodos(msg, data) {
    retrieveShowCompleted();
    if(storageAvailable("localStorage") && localStorage.getItem("todos") !== null) {
        const jsonArray = localStorage.getItem("todos");
        const todosArray = JSON.parse(jsonArray);
        todosArray.forEach(todo => {
            PubSub.publish(EventHub.topics.TODO_CREATION_REQUESTED, 
                {
                    title: todo.title,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                    project: ProjectManager.getProjectByTitle(todo.project),
                    loaded: true,
                    completed: todo.completed
                }
            );
        });
        PubSub.publish(EventHub.topics.PROJECT_SELECTED, ProjectManager.getProjectByTitle(selectedProjectTitle));
    }
}

function storeShowCompleted(msg, completedShown) {
    console.log("Test");
    if(storageAvailable("localStorage")) {
        localStorage.setItem("completedShown", JSON.stringify(completedShown));
    }
}

function retrieveShowCompleted() {
    if(storageAvailable("localStorage") && localStorage.getItem("completedShown") !== null) {
        const completedShown = JSON.parse(localStorage.getItem("completedShown"));
        if(completedShown === false) {
            const showCompleted =  $("#showCompleted");
            showCompleted.text("SHOW COMPLETED");
            showCompleted.removeClass("negative");
            $("#completedTodoList").toggle();
            $("#completedListHeading").toggle();  
        }
    }
}



export {storeProjects, retrieveProjects, storeTodos, retrieveTodos, storeShowCompleted};