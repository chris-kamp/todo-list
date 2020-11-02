import DisplayController from "./displayController";
import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";


const EventHub = (() => {
    const topics = {};
    const tokens = {};

    topics.CREATE_TODO = "Create todo";
    tokens.createTodo = PubSub.subscribe(topics.CREATE_TODO, TodoManager.createTodo);

    topics.CREATE_PROJECT = "Create project";
    tokens.createProject = PubSub.subscribe(topics.CREATE_PROJECT, ProjectManager.createProject);

    topics.PUSH_PROJECT = "Push project";
    tokens.pushToProjectList = PubSub.subscribe(topics.PUSH_PROJECT, DisplayController.pushToProjectList);
    
    return {topics, tokens};
})();

export default EventHub;