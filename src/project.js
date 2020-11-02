import EventHub from "/src/eventHub.js"

function Project({title, category, todos}) {
    title = title || nameUntitled();
    category = category || false;
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

    //If project title is a duplicate, throw error and return false
    if(checkDuplicates(title)) {
        console.log("Error! That name is taken.");
        return false;
    }

    //Check for projects with duplicate titles
    function checkDuplicates(inputTitle) {
        for (const project of ProjectManager.getProjects()) {
            if(inputTitle === project.getTitle()) {
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
    // console.log({title, category, todos});
    return {getTitle, setTitle, getCategory, setCategory, getTodos, addTodo};
}

const ProjectManager = (() => {
    //An array of all existing projects
    const projects = [];

    //Get the array of projects
    function getProjects() {
        return projects;
    }

    //Creates a new project and pushes it to the array when notified
    function createProject(msg, data) {
        const project = Project(data);
        projects.push(project);
        PubSub.publish(EventHub.topics.PUSH_PROJECT, project);
        return project;
    }

    //Initialise a default project for uncategorised todos
    function initialise() {
        PubSub.publish(EventHub.topics.CREATE_PROJECT, {title: "Uncategorised"});
    }
    
    return {createProject, getProjects, initialise};
})();


export default ProjectManager;