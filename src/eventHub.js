import Todo from "/src/todo.js";
import Project from "/src/project.js";

const EventHub = (() => {
    const topics = {};
    const datasets = {};
    const tokens = {};

    topics.ADD_TODO = "Add todo";
    datasets.ADD_TODO = {};
    tokens.Todo = PubSub.subscribe(topics.ADD_TODO, Todo);

    topics.ADD_PROJECT = "Add project";
    datasets.ADD_PROJECT = {};
    tokens.Project = PubSub.subscribe(topics.ADD_PROJECT, Project);

    return {topics, datasets, tokens};
})();

export default EventHub;