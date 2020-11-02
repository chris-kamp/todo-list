import EventHub from "/src/eventHub.js";
import {clearChildren, create} from "/src/util.js";
import ProjectManager from "/src/project.js";

const DisplayController = (() => {

    //Store references to relevant elements
    const todoTitle = document.getElementById("todoTitle");
    const todoDescription = document.getElementById("todoDescription");
    const todoDueDate = document.getElementById("todoDueDate");
    const todoCategory = document.getElementById("todoCategory");
    const todoProject = document.getElementById("todoProject");
    const projectTitle = document.getElementById("projectTitle");
    const projectCategory = document.getElementById("projectCategory");
    const projectTodos = document.getElementById("projectTodos");
    const addTodo = document.getElementById("addTodo");
    const addProject = document.getElementById("addProject");

    //Initialise event listeners and elements on page load
    const initialise = () => {

        addTodo.addEventListener("click", () => {
            PubSub.publish(EventHub.topics.CREATE_TODO, getTodoProperties());
        });

        addProject.addEventListener("click", () => {
            PubSub.publish(EventHub.topics.CREATE_PROJECT, getProjectProperties());
        });
    };

    //Get the properties of a todo to be created from inputs on the page
    const getTodoProperties = () => {
        return {
            title: todoTitle.value,
            description: todoDescription.value,
            dueDate: todoDueDate.value,
            category: todoCategory.value,
            project: ProjectManager.getProjectByTitle(todoProject.value)
        }
    };

    //Get the properties of a project to be created from inputs on the page
    const getProjectProperties = () => {
        return {
            title: projectTitle.value,
            category: projectCategory.value,
            todos: projectTodos.value
        }
    };

    //Push a project to the selection dropdown list
    const pushToProjectList = (msg, project) => {
        create({
            type: "option",
            parent: todoProject,
            textContent: project.getTitle(),
            val: project.getTitle()
        });
    };

    //Display a created todo on the page
    function displayTodo(msg, todo) {
        //For testing only. Need to get a reference to the correct element for a Todo's project.
        const parentProject = todo.getProject().getDisplayElement();
        const todoElement = create({
            type: "div",
            cl: "todo",
            parent: parentProject
        });
        const todoHeader = create({
            type: "div",
            cl: "todoHeader",
            parent: todoElement
        });
        const todoTitle = create({
            type: "p",
            cl: "todoTitle",
            textContent: `Title: ${todo.getTitle()}`,
            parent: todoHeader
        });
        const todoDescription = create({
            type: "p",
            cl: "todoDescription",
            textContent: `Description: ${todo.getDescription()}`,
            parent: todoHeader
        });
        const todoBody = create({
            type: "div",
            cl: "todoBody",
            parent: todoElement
        });
        const todoDueDate = create({
            type: "p",
            cl: "todoDueDate",
            textContent: `Due date: ${todo.getDueDate()}`,
            parent: todoBody
        });
        const todoCategory = create({
            type: "p",
            cl: "todoCategory",
            textContent: `Category: ${todo.getCategory()}`,
            parent: todoBody
        });
    }

    //Display a created project on the page
    function displayProject(msg, project) {
        //Move this is projectContainer is to be kept permanently
        const projectContainer = document.getElementById("projectContainer");
        const projectElement = create({
            type: "div",
            cl: "project",
            parent: projectContainer
        });
        const projectHeader = create({
            type: "div",
            cl: "projectHeader",
            parent: projectElement
        });
        const projectTitle = create({
            type: "div",
            cl: "projectTitle",
            textContent: `TITLE: ${project.getTitle()}`,
            parent: projectHeader
        });
        const projectCategory = create({
            type: "div",
            cl: "projectCategory",
            textContent: `CATEGORY: ${project.getCategory()}`,
            parent: projectHeader
        });
        //Link the element to its corresponding project
        project.setDisplayElement(projectElement);
    }

    return {initialise, pushToProjectList, displayTodo, displayProject};
})();

export default DisplayController;