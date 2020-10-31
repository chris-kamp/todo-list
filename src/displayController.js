import EventHub from "/src/eventHub.js"

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

    //Initialise event listeners and elements on page load
    const initialise = () => {
        const addTodo = document.getElementById("addTodo");
        addTodo.addEventListener("click", () => {
            // PubSub.publish(EventHub.topics.ADD_TODO, EventHub.datasets.ADD_TODO);
            PubSub.publish(EventHub.topics.ADD_TODO, getTodoProperties());
        });

        const addProject = document.getElementById("addProject");
        addProject.addEventListener("click", () => {
            PubSub.publish(EventHub.topics.ADD_PROJECT, getProjectProperties());
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

    return {initialise};
})();

export default DisplayController;