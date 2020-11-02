import EventHub from "/src/eventHub.js";
import {clearChildren, create} from "/src/util.js";

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

    const getTodoProperties = () => {
        return {
            title: todoTitle.value,
            description: todoDescription.value,
            dueDate: todoDueDate.value,
            category: todoCategory.value,
            project: todoProject.value
        }
    };

    const getProjectProperties = () => {
        return {
            title: projectTitle.value,
            category: projectCategory.value,
            todos: projectTodos.value
        }
    };

    const pushToProjectList = (msg, project) => {
        create({
            type: "option",
            parent: todoProject,
            textContent: project.getTitle(),
            val: project.getTitle()
        });
    };

    return {initialise, pushToProjectList};
})();

export default DisplayController;