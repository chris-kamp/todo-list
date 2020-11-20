import EventHub from "/src/eventHub.js";

function Project({title, todos}) {
    title = title || nameUntitled();
    todos = todos || [];
    let displayElement;

    function getTitle() {
        return title;
    }
    function setTitle(arg) {
        title = arg;
    }
    function getTodos() {
        return todos;
    }
    function createTodo(todo) {
        todos.push(todo);
        return todos;
    }
    function setDisplayElement(element) {
        displayElement = element;
    }
    function getDisplayElement(element) {
        return displayElement;
    }

    //If project title is a duplicate, throw error and return false
    if(checkDuplicates(title)) {
        console.log("Error! That name is taken.");
        return false;
    }

    //Check for projects with duplicate titles
    function checkDuplicates(title) {
        for (const project of ProjectManager.getProjects()) {
            if(title === project.getTitle()) {
                return true;
            }
        }
        return false;
    }

    //Consecutively number "Untitled" projects
    function nameUntitled() {
        let count = 2;
        const baseTitle = "Untitled";
        let title = baseTitle;
        while(checkDuplicates(title)) {
            title = `${baseTitle} ${count}`;
            count += 1;
        }
        return title;
    }

    //Log the project details for debugging
    // console.log({title, todos});
    return {getTitle, setTitle, getTodos, createTodo, setDisplayElement, getDisplayElement};
}

const ProjectManager = (() => {
    //An array of all existing projects
    const projects = [];

    //Get the array of projects
    function getProjects() {
        return projects;
    }

    //Find a project by title (exact match, assumes titles are unique)
    function getProjectByTitle(title) {
        for(const project of projects) {
            if(project.getTitle() === title) {
                return project;
            }
        }
        return false;
    }

    //Creates a new project and pushes it to the array when notified
    function createProject(msg, data) {
        const project = Project(data);
        //Return false if project creation throws an error and returns false
        if(project === false) {
            return false;
        }
        projects.push(project);
        PubSub.publish(EventHub.topics.PROJECT_CREATED, project);
        return project;
    }

    //When notified that a todo has been created, push it to the relevant project
    function pushTodoToProject(msg, todo) {
        todo.getProject().createTodo(todo);
    }

    //Initialise a default project for uncategorised todos
    function initialise() {
        PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, {title: "Uncategorised"});
    }
    
    return {createProject, getProjects, initialise, getProjectByTitle, pushTodoToProject};
})();


export default ProjectManager;