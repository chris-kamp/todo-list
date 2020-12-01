import EventHub from "/src/eventHub.js";

function Project({title, todos, selected}) {
    title = title || nameUntitled();
    todos = todos || [];
    let displayElement;
    selected = selected || false;

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
    function isSelected() {
        return selected;
    }
    function select() {
        selected = true;
        displayElement.removeClass("unselectedProject").addClass("selectedProject");
    }
    function deselect() {
        selected = false;
        displayElement.removeClass("selectedProject").addClass("unselectedProject");
    }

    //If project title is a duplicate, throw error and return false
    if(checkDuplicates(title)) {
        // console.log("Error! That name is taken.");
        PubSub.publish(EventHub.topics.PROJECT_CREATION_ERROR, "Error! A project of that name already exists.");
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

    return {getTitle, setTitle, getTodos, createTodo, setDisplayElement, getDisplayElement, select, deselect, isSelected};
}

const ProjectManager = (() => {
    //An array of all existing projects
    let projects = [];

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

    function setProjects(storedProjects) {
        projects = storedProjects;
    }

    //Creates a new project and pushes it to the array when notified
    function createProject(msg, data) {
        const project = Project(data);
        //Return false if project creation throws an error and returns false
        if(project === false) {
            return false;
        }
        projects.push(project);
        PubSub.publish(EventHub.topics.STORE_PROJECTS, getProjects());
        PubSub.publish(EventHub.topics.PROJECT_CREATED, project);
        return project;
    }

    //When notified that a todo has been created, push it to the relevant project
    function pushTodoToProject(msg, todo) {
        todo.getProject().createTodo(todo);
    }

    //Select a project (and deselect others)
    function select(msg, selection) {
        projects.forEach(project => {
            if(project === selection) {
                project.select();
            } else {
                project.deselect();
            }
        });
        PubSub.publish(EventHub.topics.STORE_PROJECTS, projects);
    }

    //Initialise a default project for uncategorised todos
    function initialise() {
        PubSub.publish(EventHub.topics.RETRIEVE_PROJECTS, "");
    }
    
    return {createProject, getProjects, initialise, getProjectByTitle, pushTodoToProject, select, setProjects};
})();


export default ProjectManager;