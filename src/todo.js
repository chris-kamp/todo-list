import EventHub from "/src/eventHub.js";

function Todo({title, description, dueDate, category, project}) {
    
    title = title || "Untitled";
    description = description || "No description"; //For testing, default should otherwise be blank
    dueDate = dueDate || false;
    category = category || false;
    project = project || false; //All Todos should have a project, so need error handling for this

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
    function setDueDate(arg) {
        dueDate = arg;
    }
    function getCategory() {
        return category;
    }
    function setCategory(arg) {
        category = arg;
    }
    function getProject() {
        return project;
    }
    function setProject(arg) {
        project = arg;
    }

    //If todo title is a duplicate within the same project, throw error and return false
    //WIP
    if(checkDuplicates(title)) {
        console.log("Error! A Todo of that name already exists within the same project.");
        return false;
    }

    //WIP
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

    //Log the todo details for debugging
    // console.log({title, description, dueDate, category, project});
    return {getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getCategory, setCategory, getProject, setProject};
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
        PubSub.publish(EventHub.topics.PUSH_TODO, todo);
        return todo;
    }

    return {createTodo, getTodos};
})();

export default TodoManager;