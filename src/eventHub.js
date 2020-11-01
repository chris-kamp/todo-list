import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";


const EventHub = (() => {
    const topics = {};
    const tokens = {};

    topics.ADD_TODO = "Add todo";
    tokens.Todo = PubSub.subscribe(topics.ADD_TODO, TodoManager.subscriber);

    topics.ADD_PROJECT = "Add project";
    tokens.Project = PubSub.subscribe(topics.ADD_PROJECT, ProjectManager.subscriber);
    
    return {topics, tokens};
})();

export default EventHub;