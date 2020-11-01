function Project({title, category, todos}) {
    title = title || "Untitled";
    category = category || "";
    todos = todos || [];

    function getTitle() {
        return title;
    }
    function setTitle(arg) {
        title = arg;
    }
    function getCategory() {
        return category;
    }
    function setCategory(arg) {
        category = arg;
    }
    function getTodos() {
        return todos;
    }
    function addTodo(todo) {
        todos.push(todo);
        return todos;
    }
    console.log({title, category, todos});
    return {getTitle, setTitle, getCategory, setCategory, getTodos, addTodo};
}

const ProjectManager = (() => {
    //An array of all existing projects
    const projects = [];

    //Get the array of projects
    function getProjects() {
        return projects;
    }

    //Creates a project and pushes it to the array when notified
    function subscriber(msg, data) {
        const project = Project(data);
        projects.push(project);
        return project;
    }
    
    return {subscriber, getProjects};
})();


export default ProjectManager;