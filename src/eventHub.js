import DisplayController from "./displayController";
import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";
import {validateTodo} from "/src/validation.js";
import {storeProjects, storeTodos, retrieveProjects, retrieveTodos} from "/src/storage.js";


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

    topics.TODO_CREATION_ERROR = "Todo creation error";
    //See createTodoPopup.js for subscription

    topics.PROJECT_CREATION_ERROR = "Project creation error";
    //See sidebar.js for subscription

    topics.PROJECT_CREATED = "Project created";
    tokens.displayProject = PubSub.subscribe(topics.PROJECT_CREATED, DisplayController.displayProject);

    topics.TODO_CREATED = "Todo created";
    tokens.pushTodoToProject = PubSub.subscribe(topics.TODO_CREATED, ProjectManager.pushTodoToProject);
    //See createTodoPopup.js for additional subscription    

    topics.PROJECT_SELECTED = "Project selected";
    tokens.displayTodos = PubSub.subscribe(topics.PROJECT_SELECTED, DisplayController.displayTodos);
    tokens.selectProject = PubSub.subscribe(topics.PROJECT_SELECTED, ProjectManager.select);

    //WIP - Delete?
    topics.STORE_PROJECTS = "Store projects";
    tokens.storeProjects = PubSub.subscribe(topics.STORE_PROJECTS, storeProjects);

    topics.STORE_TODOS = "Store todos";
    tokens.storeTodos = PubSub.subscribe(topics.STORE_TODOS, storeTodos);

    topics.RETRIEVE_TODOS = "Retrieve todos";
    tokens.retrieveTodos = PubSub.subscribe(topics.RETRIEVE_TODOS, retrieveTodos);

    topics.RETRIEVE_PROJECTS = "Retrieve projects";
    tokens.retrieveProjects = PubSub.subscribe(topics.RETRIEVE_PROJECTS, retrieveProjects);
    
    return {topics, tokens};
})();

export default EventHub;