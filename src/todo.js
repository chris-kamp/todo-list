import EventHub from "/src/eventHub.js";
import format from 'date-fns/format';
import ProjectManager from "./project";

function Todo({title, description, dueDate, priority, project, loaded, completed}) {
    title = title || "Untitled";
    description = description || "No description"; //For testing, default should otherwise be blank
    dueDate = dueDate || false;
    priority = priority || false;
    project = project || false; //All Todos should have a project, so need error handling for this
    loaded = loaded || false; //Whether loaded from storage. Relevant to whether the todo's parent project will be automatically selected.
    completed = completed || false; //Whether todo has been completed


    function getTitle() {
        return title;
    }
    function setTitle(arg) {
        title = arg;
    }
    function getDescription() {
        return description;
    }
    function setDescription(arg) {
        description = arg;
    }
    function getDueDate() {
        return dueDate;
    }
    function getDueDateFormatted() {
        return format(dueDate, "d MMMM yyyy");
    }
    function setDueDate(arg) {
        dueDate = arg;
    }
    function getPriority() {
        return priority;
    }
    function setPriority(arg) {
        priority = arg;
    }
    function getProject() {
        return project;
    }
    function setProject(arg) {
        project = arg;
    }
    function isLoaded() {
        return loaded;
    }
    function isCompleted() {
        return completed;
    }
    function toggleCompleted() {
        completed = !completed;
    }


    //If todo title is a duplicate within the same project, throw error and return false
    if(checkDuplicates(title)) {
        PubSub.publish(EventHub.topics.TODO_CREATION_ERROR, "Error! A Todo of that name already exists within the same project.");
        return false;
    }

    //Check for todos with duplicate titles within the same project
    function checkDuplicates(title) {
        const todos = project.getTodos();
        for (const todo of todos) {
            if(title === todo.getTitle()) {
                return true;
            }
        }
        return false;
    }

    return {getTitle, setTitle, getDescription, setDescription, getDueDate, getDueDateFormatted, setDueDate, getPriority, setPriority, getProject, setProject, isLoaded, isCompleted, toggleCompleted};
}

const TodoManager = (() => {
    //An array of all existing todos
    const todos = [];

    //Get the array of todos
    function getTodos() {
        return todos;
    }

    //A subscriber function to create a todo when notified
    function createTodo(msg, data) {
        const todo = Todo(data);
        if(todo === false) {
            return false;
        }
        todos.push(todo);
        PubSub.publish(EventHub.topics.STORE_TODOS, todos);
        PubSub.publish(EventHub.topics.TODO_CREATED, todo);
        //If todo is new and not being retrieved from storage, automatically select the project in which the todo was created
        if(todo.isLoaded()){
            const selectedProjectTitle = localStorage.getItem("selectedProjectTitle");
            const selectedProject = ProjectManager.getProjectByTitle(selectedProjectTitle);
            PubSub.publish(EventHub.topics.PROJECT_SELECTED, selectedProject);
        } else {
            PubSub.publish(EventHub.topics.PROJECT_SELECTED, todo.getProject());
        }
        return todo;
    }

    return {createTodo, getTodos};
})();

export default TodoManager;