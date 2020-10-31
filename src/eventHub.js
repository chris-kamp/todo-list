import Todo from "/src/todo.js";
import Project from "/src/project.js";
import DisplayController from "./displayController";

const EventHub = (() => {
    const topics = {};
    const tokens = {};

    topics.ADD_TODO = "Add todo";
    tokens.Todo = PubSub.subscribe(topics.ADD_TODO, Todo);

    topics.ADD_PROJECT = "Add project";
    tokens.Project = PubSub.subscribe(topics.ADD_PROJECT, Project);
    
    return {topics, tokens};
})();

export default EventHub;