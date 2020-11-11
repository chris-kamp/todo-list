import DisplayController from "./displayController";
import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";
import {validateTodo} from "/src/validation.js"


const EventHub = (() => {
    const topics = {};
    const tokens = {};

    topics.TODO_CREATION_REQUESTED = "Create todo";
    // tokens.createTodo = PubSub.subscribe(topics.TODO_CREATION_REQUESTED, TodoManager.createTodo);
    tokens.createTodo = PubSub.subscribe(topics.TODO_CREATION_REQUESTED, validateTodo);

    topics.PROJECT_CREATION_REQUESTED = "Create project";
    tokens.createProject = PubSub.subscribe(topics.PROJECT_CREATION_REQUESTED, ProjectManager.createProject);

    topics.TODO_VALIDATED = "Todo validated";
    tokens.createTodo = PubSub.subscribe(topics.TODO_VALIDATED, TodoManager.createTodo);

    topics.PROJECT_CREATED = "Push project";
    tokens.pushToProjectList = PubSub.subscribe(topics.PROJECT_CREATED, DisplayController.pushToProjectList);
    tokens.displayProject = PubSub.subscribe(topics.PROJECT_CREATED, DisplayController.displayProject);

    topics.TODO_CREATED = "Push todo";
    tokens.displayTodo = PubSub.subscribe(topics.TODO_CREATED, DisplayController.displayTodo);
    tokens.pushTodoToProject = PubSub.subscribe(topics.TODO_CREATED, ProjectManager.pushTodoToProject);

    
    return {topics, tokens};
})();

export default EventHub;