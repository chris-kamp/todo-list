import EventHub from "/src/eventHub.js"

const DisplayController = (() => {
    const initialise = () => {
        const addTodo = document.getElementById("addTodo");
        addTodo.addEventListener("click", () => {
            PubSub.publish(EventHub.topics.ADD_TODO, EventHub.datasets.ADD_TODO);
        });

        const addProject = document.getElementById("addProject");
        addProject.addEventListener("click", () => {
            PubSub.publish(EventHub.topics.ADD_PROJECT, EventHub.datasets.ADD_PROJECT);
        });
    }
    return {initialise};
})();

export default DisplayController;